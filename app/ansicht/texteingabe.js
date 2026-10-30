/* Text einfuegen: Jakob fuegt den Liedtext eines geschuetzten Liedes ein, "An die Noten anpassen" bringt ihn
   auf die Teile und Zeilen der Liedspur, die App trennt die Silben und speichert die Textspur privat auf Jarvis.
   Die Vorschau zeigt je Liedzeile die Akkorde und die Silben, so wie sie gespeichert wuerden. */
import { akkordBei, zeilenEnde, abschnittDerZeilen } from "../kern/liedspur.js";
import { textAufZeilen, textAusSpur, textAnNoten } from "../kern/textspur.js";
import { liedLaden, liedNummer, liederListe, textspurLaden, textspurSpeichern } from "../daten/lieder.js";
import { rolle } from "../daten/zugang.js";
import { esc } from "./html.js";
import { symbol } from "./symbole.js";

export async function texteingabeZeigen(wurzel, id) {
  wurzel.innerHTML = `<p class="zustand">Lied wird geladen …</p>`;
  let lied, nummer, vorhanden, wer;
  try {
    [lied, nummer, vorhanden, wer] = await Promise.all([liedLaden(id, { mitPrivatemText: false }), liedNummer(id), textspurLaden(id), rolle()]);
  } catch (fehler) {
    wurzel.innerHTML = `<div class="zustand"><p>${esc(fehler.message)}.</p><a class="knopf" href="#/">Zur Liederliste</a></div>`;
    return () => {};
  }
  if (wer !== "verwalter") {
    wurzel.innerHTML = `<div class="zustand"><p>Texte einfügen kann nur, wer mit dem Passwort angemeldet ist.</p><a class="knopf" href="#/anmelden">Anmelden</a></div>`;
    return () => {};
  }
  if (lied.gemeinfrei) {
    wurzel.innerHTML = `<div class="zustand"><p>Dieses Lied ist gemeinfrei und hat seinen Text schon.</p><a class="knopf" href="#/lied/${id}">Zum Lied</a></div>`;
    return () => {};
  }
  document.title = `Text einfügen · ${lied.titel}`;
  const suche = encodeURIComponent(lied.textsuche ?? lied.titel);
  const quellen = (lied.textquellen ?? []).filter((adresse) => adresse.startsWith("https://"))
    .map((adresse) => `<a href="${esc(adresse)}" target="_blank" rel="noopener">${esc(new URL(adresse).hostname.replace(/^www\./, ""))}</a>`);
  /* Zu jeder Liedzeile ihr Teil (Strophe, Refrain, …): sagt, welche Teile des Textes hineingehoeren */
  const teile = abschnittDerZeilen(lied);
  const teilfolge = teile.reduce((folge, teil) => {
    if (folge.length && folge.at(-1).teil === teil) folge.at(-1).zeilen++; else folge.push({ teil, zeilen: 1 });
    return folge;
  }, []);
  const teilText = teilfolge.map(({ teil, zeilen }) => `${teil?.name ?? "Zeilen"} ${zeilen}`).join(" · ");
  wurzel.innerHTML = `
  <article class="texteingabe">
    <header class="seitenkopf">
      <a class="zurueck" href="#/lied/${id}" aria-label="Zurück zum Lied">${symbol("zurueck")}</a>
      <span class="nr">${nummer ?? ""}</span>
      <div class="titel"><h1>Text einfügen</h1><p>${esc(lied.titel)} · ${lied.zeilen.length} Liedzeilen</p></div>
    </header>
    <section class="anleitung">
      <p>Die Liedspur hat ${lied.zeilen.length} Zeilen: <b>${esc(teilText)}</b>. Füge den ganzen Liedtext ein, so wie er auf der Liedseite steht, und tippe auf <b>An die Noten anpassen</b>: Die App sucht die passenden Teile heraus und verteilt die Wörter auf die Liedzeilen.</p>
      <p>Prüfe danach die Vorschau unten; passt ein Wort nicht zu seinem Akkord, verschiebe es im Feld. Eine Zeile nur mit <b>-</b> bleibt ohne Text. Die Silben trennt die App selbst; wo sie falsch trennt, setz Bindestriche (<b>Sponge-Bob</b>). Mit <b>|</b> verteilst du eine Zeile auf die Takte, ein Teil mehr als Takte wird zum Auftakt.</p>
      ${lied.texthinweis ? `<p class="leise">${esc(lied.texthinweis)}</p>` : ""}
      <p class="suche">${quellen.length ? `Text öffnen: ${quellen.join(" · ")} · ` : ""}Suchen bei
        <a href="https://genius.com/search?q=${suche}" target="_blank" rel="noopener">Genius</a> ·
        <a href="https://www.musixmatch.com/de/search/${suche}" target="_blank" rel="noopener">Musixmatch</a></p>
    </section>
    <label class="feldname" for="liedtext">Liedtext</label>
    <textarea id="liedtext" rows="10" spellcheck="false" autocapitalize="sentences">${esc(vorhanden ? textAusSpur(lied, vorhanden) : "")}</textarea>
    <p class="hinweise" aria-live="polite"></p>
    <div class="aktionen">
      <button class="knopf anpassen" type="button">An die Noten anpassen</button>
      <button class="knopf speichern" type="button">Text speichern</button>
      <p class="status" role="status"></p>
    </div>
    <h2 class="vorschaukopf">So liegt der Text auf den Zeilen</h2>
    <ol class="vorschau"></ol>
  </article>`;

  const feld = wurzel.querySelector("#liedtext"), hinweise = wurzel.querySelector(".hinweise");
  const vorschau = wurzel.querySelector(".vorschau"), status = wurzel.querySelector(".status");
  let ergebnis = null;

  function akkordfolge(index) {
    const von = lied.zeilen[index], bis = zeilenEnde(lied, index);
    const folge = [akkordBei(lied, von), ...lied.akkorde.filter((akkord) => akkord.ab > von && akkord.ab < bis)];
    return folge.map((akkord) => akkord.akk).join(" ");
  }
  function aktualisieren() {
    ergebnis = textAufZeilen(lied, feld.value);
    hinweise.textContent = ergebnis.hinweise.join(" ");
    const { spur } = ergebnis;
    vorschau.innerHTML = lied.zeilen.map((_, i) => {
      const von = spur.zeilen[i], bis = spur.zeilen[i + 1] ?? lied.laenge;
      const silben = spur.silben.filter((silbe) => silbe.ab >= von && silbe.ab < bis).map((silbe) => silbe.text).join(" ").replace(/- /g, "-");
      const teilname = teile[i] && teile[i] !== teile[i - 1] ? `<b class="teilname">${esc(teile[i].name)}</b> ` : "";
      return `<li><span class="akkorde">${teilname}${esc(akkordfolge(i))}</span><span class="${silben ? "silben" : "silben leer"}">${silben ? esc(silben) : "ohne Text"}</span></li>`;
    }).join("");
  }
  /* Nach dem Speichern gleich zum naechsten Lied ohne Text, damit alle in einem Rutsch gehen */
  async function naechstesOhneText() {
    const lieder = await liederListe();
    const hier = lieder.findIndex((eintrag) => eintrag.id === id);
    return [...lieder.slice(hier + 1), ...lieder.slice(0, hier)].find((eintrag) => !eintrag.mitText && !eintrag.gemeinfrei);
  }
  async function speichern() {
    status.textContent = "Wird gespeichert …";
    try {
      await textspurSpeichern(id, ergebnis.spur);
    } catch (fehler) {
      status.textContent = `Nicht gespeichert: ${fehler.message}`;
      return;
    }
    status.innerHTML = `Gespeichert. <a href="#/lied/${id}">Zum Lied</a>`;
    try {
      const naechstes = await naechstesOhneText();
      status.innerHTML += naechstes ? ` · <a href="#/lied/${naechstes.id}/text">Weiter: ${esc(naechstes.titel)}</a>` : " · Alle Lieder haben jetzt Text.";
    } catch (fehler) {
      console.info("Naechstes Lied ohne Text nicht ermittelt:", fehler.message);
    }
  }

  /* Der angepasste Text ersetzt das Feld, damit Jakob ihn vor dem Speichern noch verschieben kann */
  function anpassen() {
    const angepasst = textAnNoten(lied, feld.value);
    feld.value = angepasst.text;
    status.textContent = "";
    aktualisieren();
    hinweise.textContent = [...angepasst.hinweise, ...ergebnis.hinweise].join(" ");
  }

  feld.addEventListener("input", () => { status.textContent = ""; aktualisieren(); });
  wurzel.querySelector(".anpassen").addEventListener("click", anpassen);
  wurzel.querySelector(".speichern").addEventListener("click", speichern);
  aktualisieren();
  return () => {};
}
