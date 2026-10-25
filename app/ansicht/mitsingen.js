/* Mitsingen fuer Freunde: Der Liedtext laeuft im Takt von Jakobs Handy mit. Kein Anmelden, der Runden-Link genuegt.
   Der Server schickt nur Aenderungen (Start, Pause, Tempo, Sprung, Liedwechsel); dazwischen rechnet jedes Handy
   die Stelle selbst aus Jakobs letztem Stand weiter (kern/runde.js). */
import { viertelProTakt } from "../kern/liedspur.js";
import { positionNach } from "../kern/runde.js";
import { textspurAnwenden } from "../kern/textspur.js";
import { liedLaden, liedNummer } from "../daten/lieder.js";
import { rundeVerfolgen, rundentextLaden } from "../daten/runde.js";
import { textAnlegen } from "./spuren.js";
import { symbol } from "./symbole.js";

export async function mitsingenZeigen(wurzel, token) {
  wurzel.innerHTML = geruestHTML();
  const teil = (name) => wurzel.querySelector(`.${name}`);
  const zustand = { stand: null, lied: null, nummer: null, text: null, laedt: null, verbunden: true, vorbei: false, bild: 0, wachbleiben: null };
  let verfolgung = null;

  function standErhalten(stand) {
    zustand.stand = stand;
    if (stand.lied === zustand.lied?.id) return anzeigenStarten();
    statusZeigen();
    liedWechseln(stand.lied);
  }

  /* Kommt waehrend des Ladens schon das naechste Lied, gewinnt das neuere */
  async function liedWechseln(id) {
    if (zustand.laedt === id) return;
    zustand.laedt = id;
    try {
      const [lied, nummer] = await Promise.all([liedLaden(id, { mitPrivatemText: false }), liedNummer(id)]);
      const spur = lied.gemeinfrei ? null : await rundentextLaden(token, id);
      if (zustand.laedt !== id) return;
      zustand.lied = textspurAnwenden(lied, spur);
      zustand.nummer = nummer;
      zustand.text = textAnlegen(teil("text"), zustand.lied, 0);
      teil("liedtitel").textContent = zustand.lied.titel;
      teil("hinweis").hidden = zustand.lied.silben.length > 0;
      document.title = `${zustand.lied.titel} · Mitsingen`;
    } catch (fehler) {
      /* 409: Jakob hat schon wieder gewechselt, der Stand dazu ist unterwegs */
      if (fehler.status !== 409) teil("rundenstatus").textContent = `Lied nicht ladbar: ${fehler.message}`;
      return;
    } finally {
      if (zustand.laedt === id) zustand.laedt = null;
    }
    anzeigenStarten();
  }

  function anzeigen() {
    const position = positionNach(zustand.lied, zustand.stand, verfolgung.serverJetzt());
    zustand.text.zeigen(position);
    const zahl = teil("nr"), zaehlt = zustand.stand.laeuft && position < 0;
    zahl.textContent = zaehlt ? String(Math.floor(position + viertelProTakt(zustand.lied)) + 1) : zustand.nummer ?? "·";
    zahl.classList.toggle("einzaehlen", zaehlt);
  }
  /* Laeuft nur, solange das geladene Lied auch das gespielte ist; ein Wechsel haelt sie an, bis das neue da ist */
  function bildschleife() {
    if (zustand.stand.lied !== zustand.lied.id) return;
    anzeigen();
    if (zustand.stand.laeuft && !zustand.vorbei) zustand.bild = requestAnimationFrame(bildschleife);
  }
  function anzeigenStarten() {
    statusZeigen();
    if (!verfolgung || !zustand.lied || !zustand.stand) return;
    cancelAnimationFrame(zustand.bild);
    bildschleife();
  }
  const wachFreigeben = () => zustand.wachbleiben?.release().catch((fehler) => console.info("Wach-Sperre nicht freigegeben:", fehler.message));

  function statusZeigen() {
    const { stand } = zustand;
    let text = "Verbinde mit der Runde …";
    if (zustand.vorbei) text = "Die Runde ist beendet.";
    else if (!zustand.verbunden) text = "Verbindung weg, verbinde neu …";
    else if (stand && stand.lied !== zustand.lied?.id) text = "Lied wird geladen …";
    else if (stand?.laeuft) text = stand.faktor < 1 ? `Läuft · Übungstempo ${Math.round(stand.faktor * 100)} %` : "Läuft";
    else if (stand) text = "Pausiert";
    const status = teil("rundenstatus");
    if (status.textContent !== text) status.textContent = text;
  }
  function verbindungZeigen(verbunden) {
    zustand.verbunden = verbunden;
    statusZeigen();
  }
  function rundeVorbei() {
    zustand.vorbei = true;
    cancelAnimationFrame(zustand.bild);
    verfolgung?.schliessen();
    wachFreigeben();
    statusZeigen();
  }

  /* Wer mitliest, tippt nichts an; der Bildschirm soll trotzdem anbleiben */
  async function wachHalten() {
    try {
      zustand.wachbleiben = await navigator.wakeLock?.request("screen");
    } catch (fehler) {
      console.info("Bildschirm kann nicht wach gehalten werden:", fehler.message);
    }
  }
  /* Nach dem Aufwachen kann die eigene Uhr gestanden haben: Versatz neu messen */
  const sichtbarkeit = () => {
    if (document.visibilityState !== "visible" || zustand.vorbei) return;
    wachHalten();
    verfolgung?.neuMessen();
  };

  try {
    verfolgung = await rundeVerfolgen(token, { stand: standErhalten, ende: rundeVorbei, verbindung: verbindungZeigen });
  } catch (fehler) {
    const text = fehler.status === 404 ? "Diese Runde ist vorbei. Frag nach einem neuen Code." : `Keine Verbindung zur Runde: ${fehler.message}`;
    wurzel.innerHTML = `<div class="zustand"><p></p><a class="knopf" href="#/">Zur Liederliste</a></div>`;
    wurzel.querySelector(".zustand p").textContent = text;
    return () => {};
  }
  anzeigenStarten();
  wachHalten();
  document.addEventListener("visibilitychange", sichtbarkeit);

  return function aufraeumen() {
    cancelAnimationFrame(zustand.bild);
    verfolgung.schliessen();
    wachFreigeben();
    document.removeEventListener("visibilitychange", sichtbarkeit);
  };
}

function geruestHTML() {
  return `
  <article class="mitsingen">
    <header class="kopf">
      <a class="zurueck" href="#/" aria-label="Zur Liederliste">${symbol("zurueck")}</a>
      <span class="nr" aria-label="Liednummer"></span>
      <div class="titel">
        <h1 class="liedtitel">Mitsingen</h1>
        <p class="rundenstatus" aria-live="polite">Verbinde mit der Runde …</p>
      </div>
    </header>
    <section class="text" aria-label="Liedtext">
      <p class="zeile vorige"></p>
      <p class="zeile aktuelle"></p>
      <p class="zeile kommende"></p>
      <p class="hinweis" hidden>Für dieses Lied ist noch kein Text hinterlegt. Die Zeile zeigt die Akkordfolge.</p>
    </section>
  </article>`;
}
