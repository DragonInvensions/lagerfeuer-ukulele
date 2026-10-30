/* Liederliste: nummeriert wie im Liederbuch, nach Stufe gegliedert.
   Oben rechts: anmelden, oder mit Passwort einen Einmal-Link fuer ein Geraet erzeugen. */
import { esc } from "./html.js";
import { liederListe, listeVergessen } from "../daten/lieder.js";
import { rolle, abmelden, einmalLinkErzeugen } from "../daten/zugang.js";
import { linkzeileHTML, linkzeileAnbinden } from "./linkzeile.js";

export async function listeZeigen(wurzel) {
  wurzel.innerHTML = `<p class="zustand">Lieder werden geladen …</p>`;
  let lieder, wer;
  try {
    [lieder, wer] = await Promise.all([liederListe(), rolle()]);
  } catch (fehler) {
    wurzel.innerHTML = `<div class="zustand"><p>${esc(fehler.message)}. Läuft der Server?</p></div>`;
    return () => {};
  }
  document.title = "Lagerfeuer-Ukulele";
  const stufen = [...new Set(lieder.map((lied) => lied.stufe))];
  const marke = (lied) => {
    if (lied.mitText) return "";
    return `<span class="marke">${wer === "verwalter" ? "Text fehlt" : "nur Akkorde"}</span>`;
  };
  wurzel.innerHTML = `
  <article class="liste">
    <header class="listenkopf">
      <img src="icon.svg" alt="" width="44" height="44"><h1>Lagerfeuer-Ukulele</h1>
      <div class="kopfaktionen">${kopfaktionenHTML(wer)}</div>
    </header>
    ${textauftragHTML(lieder, wer)}
    <section class="einladung" hidden aria-live="polite"></section>
    ${stufen.map((stufe) => `
      <section aria-labelledby="stufe-${stufe}">
        <h2 id="stufe-${stufe}">Stufe ${stufe}</h2>
        <ol class="lieder">
          ${lieder.map((lied, i) => ({ lied, nummer: i + 1 })).filter(({ lied }) => lied.stufe === stufe).map(({ lied, nummer }) => `
            <li><a href="#/lied/${lied.id}">
              <span class="nr">${nummer}</span>
              <span class="liedtitel">${esc(lied.titel)}<small>${esc(lied.untertitel)}</small></span>
              ${marke(lied)}
            </a></li>`).join("")}
        </ol>
      </section>`).join("")}
  </article>`;

  wurzel.querySelector(".abmelden")?.addEventListener("click", async () => {
    await abmelden();
    listeVergessen();
    listeZeigen(wurzel);
  });
  wurzel.querySelector(".einladen")?.addEventListener("click", () => einladungZeigen(wurzel.querySelector(".einladung")));
  return () => {};
}

function kopfaktionenHTML(wer) {
  if (!wer) return `<a class="kopfknopf" href="#/anmelden">Anmelden</a>`;
  return `${wer === "verwalter" ? `<button class="kopfknopf einladen" type="button">Gerät einladen</button>` : ""}
    <button class="kopfknopf abmelden" type="button">Abmelden</button>`;
}

/* Mit Passwort: wie vielen geschuetzten Liedern der Text fehlt, und der Einstieg ins Ergaenzen */
function textauftragHTML(lieder, wer) {
  if (wer !== "verwalter") return "";
  const fehlend = lieder.filter((lied) => !lied.mitText && !lied.gemeinfrei);
  if (!fehlend.length) return "";
  return `<p class="leise textauftrag">${fehlend.length === 1 ? "Einem Lied fehlt" : `${fehlend.length} Liedern fehlt`} noch der Text. <a href="#/lied/${fehlend[0].id}/text">Jetzt ergänzen</a></p>`;
}

/* Einmal-Link fuer ein Geraet: gilt einmal und 14 Tage, das Geraet kann danach alle Texte lesen */
async function einladungZeigen(bereich) {
  bereich.hidden = false;
  bereich.textContent = "Link wird erzeugt …";
  try {
    const link = await einmalLinkErzeugen("Einladung aus der Liederliste");
    bereich.innerHTML = `
      <p><b>Einmal-Link</b> · gilt für ein Gerät und 14 Tage. Wer ihn öffnet, kann alle Liedtexte lesen, aber nichts ändern.</p>
      ${linkzeileHTML(link, "Einmal-Link")}`;
    linkzeileAnbinden(bereich);
  } catch (fehler) {
    bereich.textContent = `Kein Link erzeugt: ${fehler.message}`;
  }
}
