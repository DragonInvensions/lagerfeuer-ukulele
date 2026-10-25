/* Liederliste: nummeriert wie im Liederbuch, nach Stufe gegliedert. */
import { esc } from "./html.js";
import { liederListe } from "../daten/lieder.js";

export async function listeZeigen(wurzel) {
  wurzel.innerHTML = `<p class="zustand">Lieder werden geladen …</p>`;
  let lieder;
  try {
    lieder = await liederListe();
  } catch (fehler) {
    wurzel.innerHTML = `<div class="zustand"><p>${esc(fehler.message)}. Läuft der Server?</p></div>`;
    return () => {};
  }
  document.title = "Lagerfeuer-Ukulele";
  const stufen = [...new Set(lieder.map((lied) => lied.stufe))];
  wurzel.innerHTML = `
  <article class="liste">
    <header class="listenkopf"><img src="icon.svg" alt="" width="44" height="44"><h1>Lagerfeuer-Ukulele</h1></header>
    ${stufen.map((stufe) => `
      <section aria-labelledby="stufe-${stufe}">
        <h2 id="stufe-${stufe}">Stufe ${stufe}</h2>
        <ol class="lieder">
          ${lieder.map((lied, i) => ({ lied, nummer: i + 1 })).filter(({ lied }) => lied.stufe === stufe).map(({ lied, nummer }) => `
            <li><a href="#/lied/${lied.id}">
              <span class="nr">${nummer}</span>
              <span class="liedtitel">${esc(lied.titel)}<small>${esc(lied.untertitel)}</small></span>
              ${lied.mitText ? "" : `<span class="marke">nur Akkorde</span>`}
            </a></li>`).join("")}
        </ol>
      </section>`).join("")}
  </article>`;
  return () => {};
}
