/* Text einfuegen: Jakob fuegt den Liedtext eines geschuetzten Liedes ein, die App trennt die Silben,
   legt jede Zeile auf ihre Liedzeile und speichert die Textspur privat auf Jarvis.
   Die Vorschau zeigt je Liedzeile die Akkorde und die Silben, so wie sie gespeichert wuerden. */
import { akkordBei, zeilenEnde } from "../kern/liedspur.js";
import { textAufZeilen, textAusSpur } from "../kern/textspur.js";
import { liedLaden, liedNummer, textspurLaden, textspurSpeichern } from "../daten/lieder.js";
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
  wurzel.innerHTML = `
  <article class="texteingabe">
    <header class="seitenkopf">
      <a class="zurueck" href="#/lied/${id}" aria-label="Zurück zum Lied">${symbol("zurueck")}</a>
      <span class="nr">${nummer ?? ""}</span>
      <div class="titel"><h1>Text einfügen</h1><p>${esc(lied.titel)} · ${lied.zeilen.length} Liedzeilen</p></div>
    </header>
    <section class="anleitung">
      <p>Eine Textzeile je Liedzeile, Leerzeilen zählen nicht. Die Silben trennt die App selbst; wo sie falsch trennt, setz Bindestriche (<b>Sponge-Bob</b>). Mit <b>|</b> verteilst du eine Zeile auf die Takte, ein Teil mehr als Takte wird zum Auftakt.</p>
      ${lied.texthinweis ? `<p class="leise">${esc(lied.texthinweis)}</p>` : ""}
      <p class="suche">Text suchen bei
        <a href="https://genius.com/search?q=${suche}" target="_blank" rel="noopener">Genius</a> ·
        <a href="https://www.musixmatch.com/de/search/${suche}" target="_blank" rel="noopener">Musixmatch</a></p>
    </section>
    <label class="feldname" for="liedtext">Liedtext</label>
    <textarea id="liedtext" rows="10" spellcheck="false" autocapitalize="sentences">${esc(vorhanden ? textAusSpur(lied, vorhanden) : "")}</textarea>
    <p class="hinweise" aria-live="polite"></p>
    <div class="aktionen">
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
      return `<li><span class="akkorde">${esc(akkordfolge(i))}</span><span class="${silben ? "silben" : "silben leer"}">${silben ? esc(silben) : "ohne Text"}</span></li>`;
    }).join("");
  }
  async function speichern() {
    status.textContent = "Wird gespeichert …";
    try {
      await textspurSpeichern(id, ergebnis.spur);
      status.innerHTML = `Gespeichert. <a href="#/lied/${id}">Zum Lied</a>`;
    } catch (fehler) {
      status.textContent = `Nicht gespeichert: ${fehler.message}`;
    }
  }

  feld.addEventListener("input", () => { status.textContent = ""; aktualisieren(); });
  wurzel.querySelector(".speichern").addEventListener("click", speichern);
  aktualisieren();
  return () => {};
}
