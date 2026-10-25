/* Ein Link zum Weitergeben: Feld zum Markieren und ein Knopf, der in die Zwischenablage kopiert.
   Ohne Zwischenablage (kein HTTPS, keine Erlaubnis) wird das Feld markiert, dann kopiert man selbst. */
import { esc } from "./html.js";

export function linkzeileHTML(link, beschriftung) {
  return `<p class="linkzeile"><input class="linkfeld" type="text" readonly value="${esc(link)}" aria-label="${esc(beschriftung)}">
      <button class="kopfknopf kopieren" type="button">Kopieren</button></p>`;
}

export function linkzeileAnbinden(bereich) {
  const feld = bereich.querySelector(".linkfeld");
  bereich.querySelector(".kopieren").addEventListener("click", async (ereignis) => {
    try {
      await navigator.clipboard.writeText(feld.value);
      ereignis.target.textContent = "Kopiert";
    } catch {
      feld.select();
      ereignis.target.textContent = "Markiert";
    }
  });
}
