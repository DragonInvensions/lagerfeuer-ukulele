/* Anmelden mit Jakobs Passwort. Kommt man von einem verbrauchten Einmal-Link, steht hier warum. */
import { anmelden } from "../daten/zugang.js";
import { listeVergessen } from "../daten/lieder.js";
import { symbol } from "./symbole.js";

const LINK_FEHLER = {
  benutzt: "Dieser Einmal-Link wurde schon benutzt. Bitte Jakob um einen neuen.",
  abgelaufen: "Dieser Einmal-Link ist abgelaufen. Bitte Jakob um einen neuen.",
  unbekannt: "Diesen Einmal-Link kennt die App nicht. Bitte Jakob um einen neuen.",
};

export async function anmeldenZeigen(wurzel, linkFehler) {
  document.title = "Anmelden · Lagerfeuer-Ukulele";
  wurzel.innerHTML = `
  <article class="anmelden">
    <header class="seitenkopf">
      <a class="zurueck" href="#/" aria-label="Zur Liederliste">${symbol("zurueck")}</a>
      <h1>Anmelden</h1>
    </header>
    ${LINK_FEHLER[linkFehler] ? `<p class="meldung">${LINK_FEHLER[linkFehler]}</p>` : ""}
    <form class="formular">
      <label for="passwort">Passwort</label>
      <input id="passwort" name="passwort" type="password" autocomplete="current-password" required minlength="10">
      <p class="fehler" role="alert"></p>
      <button class="knopf" type="submit">Anmelden</button>
    </form>
    <p class="leise">Mit dem Passwort siehst du die geschützten Liedtexte und kannst sie einfügen. Freunde brauchen kein Passwort, sie bekommen einen Einmal-Link.</p>
  </article>`;
  const formular = wurzel.querySelector("form"), fehler = wurzel.querySelector(".fehler");
  formular.addEventListener("submit", async (ereignis) => {
    ereignis.preventDefault();
    fehler.textContent = "";
    try {
      await anmelden(formular.passwort.value);
      listeVergessen();
      location.hash = "#/";
    } catch (problem) {
      fehler.textContent = problem.message;
      formular.passwort.select();
    }
  });
  formular.passwort.focus();
  return () => {};
}
