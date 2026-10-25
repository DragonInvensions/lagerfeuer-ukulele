/* Mitspiel-Bildschirm: verbindet Lied, Uhr und Spuren und haelt die Bedienung. */
import { esc } from "./html.js";
import { viertelProTakt, taktUndSchlag } from "../kern/liedspur.js";
import { schlagmusterNamens } from "../kern/schlagmuster.js";
import { KLANGMODI } from "../kern/taktgeber.js";
import { liedLaden, liedNummer } from "../daten/lieder.js";
import { rolle } from "../daten/zugang.js";
import { metronomUhr } from "../uhren/metronom.js";
import { fadenAnlegen, griffAnlegen, textAnlegen, schlagAnlegen } from "./spuren.js";
import { rundenleitungAnlegen } from "./rundenleitung.js";
import { symbol } from "./symbole.js";

const TEMPI = [0.5, 0.6, 0.7, 0.8, 0.9, 1];
const KLANG_SPEICHER = "ukulele.klang";

export async function mitspielenZeigen(wurzel, id) {
  wurzel.innerHTML = `<p class="zustand">Lied wird geladen …</p>`;
  let lied, nummer, wer;
  try {
    [lied, nummer, wer] = await Promise.all([liedLaden(id), liedNummer(id), rolle()]);
  } catch (fehler) {
    wurzel.innerHTML = `<div class="zustand"><p>${esc(fehler.message)}.</p><a class="knopf" href="#/">Zur Liederliste</a></div>`;
    return () => {};
  }
  wurzel.innerHTML = geruestHTML(lied, nummer, wer);
  document.title = `${lied.titel} · Lagerfeuer-Ukulele`;

  const teil = (name) => wurzel.querySelector(`.${name}`);
  const muster = schlagmusterNamens(lied.schlagmuster);
  const uhr = metronomUhr(lied, muster);
  const halbtoene = 0;
  const spuren = [
    fadenAnlegen(teil("faden"), lied, halbtoene),
    griffAnlegen(teil("griff"), lied, halbtoene),
    textAnlegen(teil("text"), lied, halbtoene),
    schlagAnlegen(teil("schlag"), muster),
  ];
  const zustand = { tempoStufe: 3, schleife: null, feuer: false, wachbleiben: null, bild: 0 };
  /* Mitsingen leiten kann nur, wer mit Passwort angemeldet ist; Freunde lesen ueber den Runden-Link mit */
  const leitung = wer === "verwalter"
    ? rundenleitungAnlegen(teil("rundenknopf"), teil("rundendialog"),
      () => ({ lied: lied.id, position: uhr.position(), faktor: TEMPI[zustand.tempoStufe], laeuft: uhr.laeuft }))
    : null;

  function anzeigen() {
    let position = uhr.position();
    if (zustand.schleife && position >= zustand.schleife.bis) {
      uhr.springen(zustand.schleife.von);
      position = zustand.schleife.von;
      leitung?.melden();
    }
    if (position >= lied.laenge) {
      uhr.anhalten();
      uhr.springen(-uhr.einzaehlen);
      startKnopfZeigen();
      position = -uhr.einzaehlen;
      leitung?.melden();
    }
    uhr.klaengeEinplanen();
    for (const spur of spuren) spur.zeigen(position);
    kopfZeigen(position);
  }

  /* Eine einzige Bildschleife, solange die Uhr laeuft; alles andere zeichnet nur einmal */
  function bildschleife() {
    anzeigen();
    if (uhr.laeuft) zustand.bild = requestAnimationFrame(bildschleife);
  }

  function kopfZeigen(position) {
    const zahl = teil("nr");
    const zaehlt = uhr.laeuft && position < 0;
    zahl.textContent = zaehlt ? String(Math.floor(position + uhr.einzaehlen) + 1) : nummer ?? "·";
    zahl.classList.toggle("einzaehlen", zaehlt);
    const { takt, schlag } = taktUndSchlag(lied, Math.max(position, 0));
    teil("zaehler").textContent = zaehlt ? "einzählen" : position < 0 ? "" : `Takt ${takt} · ${schlag}`;
    const abschnitt = [...(lied.abschnitte ?? [])].reverse().find((eintrag) => eintrag.ab <= Math.max(position, 0));
    teil("abschnitt").textContent = abschnitt?.name ?? "";
  }

  function startKnopfZeigen() {
    const knopf = teil("start");
    knopf.innerHTML = symbol(uhr.laeuft ? "pause" : "start");
    knopf.setAttribute("aria-label", uhr.laeuft ? "Anhalten" : "Abspielen");
  }

  function umschalten() {
    if (uhr.laeuft) {
      uhr.anhalten();
      cancelAnimationFrame(zustand.bild);
    } else {
      uhr.starten();
      zustand.bild = requestAnimationFrame(bildschleife);
    }
    startKnopfZeigen();
    leitung?.melden();
  }

  function tempoAendern(schritt) {
    zustand.tempoStufe = Math.min(Math.max(zustand.tempoStufe + schritt, 0), TEMPI.length - 1);
    uhr.tempoSetzen(TEMPI[zustand.tempoStufe]);
    if (schritt) leitung?.melden();
    teil("tempowert").textContent = `${Math.round(TEMPI[zustand.tempoStufe] * 100)} %`;
    teil("langsamer").disabled = zustand.tempoStufe === 0;
    teil("schneller").disabled = zustand.tempoStufe === TEMPI.length - 1;
  }

  /* Schleife ueber den Abschnitt, in dem man gerade ist */
  function schleifeUmschalten() {
    const knopf = teil("schleife");
    if (zustand.schleife) {
      zustand.schleife = null;
    } else {
      const position = Math.max(uhr.position(), 0);
      const abschnitte = lied.abschnitte?.length ? lied.abschnitte : [{ ab: 0 }];
      const index = abschnitte.findLastIndex((eintrag) => eintrag.ab <= position);
      zustand.schleife = { von: abschnitte[index].ab, bis: abschnitte[index + 1]?.ab ?? lied.laenge };
    }
    knopf.setAttribute("aria-pressed", String(Boolean(zustand.schleife)));
    spuren[0].schleifeZeigen(zustand.schleife);
    anzeigen();
  }

  async function feuerUmschalten() {
    zustand.feuer = !zustand.feuer;
    document.body.classList.toggle("feuer", zustand.feuer);
    teil("feuermodus").setAttribute("aria-pressed", String(zustand.feuer));
    if (zustand.feuer) await wachHalten(); else zustand.wachbleiben?.release().catch(() => {});
    spuren[0].neuBauen();
    anzeigen();
  }

  /* Taktgeber: Aus, Takt-Klick oder Ab/Auf nach dem Schlagmuster; die Wahl merkt sich das Geraet */
  function klangWaehlen(modus) {
    uhr.modusSetzen(modus);
    wurzel.querySelectorAll(".klangwahl button").forEach((knopf) => knopf.setAttribute("aria-pressed", String(knopf.dataset.modus === modus)));
    try { localStorage.setItem(KLANG_SPEICHER, modus); } catch (fehler) { console.info("Klangwahl nicht gespeichert:", fehler.message); }
  }
  function gemerkterKlang() {
    try {
      const gemerkt = localStorage.getItem(KLANG_SPEICHER);
      return KLANGMODI.includes(gemerkt) ? gemerkt : "takt";
    } catch {
      return "takt";
    }
  }

  /* Am Feuer soll der Bildschirm nicht ausgehen; ohne Wake Lock geht es trotzdem weiter */
  async function wachHalten() {
    try {
      zustand.wachbleiben = await navigator.wakeLock?.request("screen");
    } catch (fehler) {
      console.info("Bildschirm kann nicht wach gehalten werden:", fehler.message);
    }
  }
  const sichtbarkeit = () => { if (zustand.feuer && document.visibilityState === "visible") wachHalten(); };
  const taste = (ereignis) => {
    if (ereignis.code === "Space" && !ereignis.target.closest("button, a, input")) { ereignis.preventDefault(); umschalten(); }
  };
  const groesse = () => { spuren[0].neuBauen(); anzeigen(); };

  teil("start").addEventListener("click", umschalten);
  teil("langsamer").addEventListener("click", () => tempoAendern(-1));
  teil("schneller").addEventListener("click", () => tempoAendern(1));
  teil("schleife").addEventListener("click", schleifeUmschalten);
  teil("feuermodus").addEventListener("click", feuerUmschalten);
  wurzel.querySelectorAll(".klangwahl button").forEach((knopf) => knopf.addEventListener("click", () => klangWaehlen(knopf.dataset.modus)));
  document.addEventListener("keydown", taste);
  document.addEventListener("visibilitychange", sichtbarkeit);
  window.addEventListener("resize", groesse);

  tempoAendern(0);
  klangWaehlen(gemerkterKlang());
  startKnopfZeigen();
  anzeigen();

  return function aufraeumen() {
    cancelAnimationFrame(zustand.bild);
    leitung?.beenden();
    uhr.beenden();
    zustand.wachbleiben?.release().catch(() => {});
    document.body.classList.remove("feuer");
    document.removeEventListener("keydown", taste);
    document.removeEventListener("visibilitychange", sichtbarkeit);
    window.removeEventListener("resize", groesse);
  };
}

function tonartText(tonart) {
  if (!tonart) return "";
  return tonart.endsWith("m") ? `${tonart.slice(0, -1).toLowerCase()}-Moll` : `${tonart}-Dur`;
}

/* Was unter dem Liedtext steht, haengt davon ab, ob es Text gibt und wer angemeldet ist */
function texthinweisHTML(lied, wer) {
  if (lied.gemeinfrei) return "";
  if (lied.silben.length === 0) {
    if (!wer) return `<p class="hinweis">Der Text dieses Liedes ist geschützt. <a href="#/anmelden">Melde dich an</a>, dann steht er hier. Bis dahin zeigt die Zeile die Akkordfolge.</p>`;
    if (wer === "verwalter") return `<p class="hinweis">Für dieses Lied ist noch kein Text hinterlegt. <a href="#/lied/${lied.id}/text">Text einfügen</a></p>`;
    return `<p class="hinweis">Für dieses Lied ist noch kein Text hinterlegt. Bis dahin zeigt die Zeile die Akkordfolge.</p>`;
  }
  return wer === "verwalter" ? `<p class="hinweis"><a href="#/lied/${lied.id}/text">Text bearbeiten</a></p>` : "";
}

function geruestHTML(lied, nummer, wer) {
  const ohneText = lied.silben.length === 0;
  return `
  <article class="mitspielen" data-takt="${viertelProTakt(lied)}">
    <header class="kopf">
      <a class="zurueck" href="#/" aria-label="Zur Liederliste">${symbol("zurueck")}</a>
      <span class="nr" aria-label="Liednummer">${nummer ?? ""}</span>
      <div class="titel">
        <h1>${esc(lied.titel)}</h1>
        <p>Stufe ${lied.stufe} · ${tonartText(lied.tonart)} · <span class="abschnitt"></span></p>
      </div>
      ${wer === "verwalter" ? `<button class="rundenknopf umschalter" type="button" aria-pressed="false" aria-haspopup="dialog">${symbol("mitsingen")}<span>Mitsingen</span></button>
      <dialog class="rundendialog" aria-label="Mitsingen"></dialog>` : ""}
    </header>
    <section class="faden" aria-label="Akkorde im Zeitverlauf"><div class="streifen"></div><i class="nadel" aria-hidden="true"></i></section>
    <section class="griff" aria-live="polite">
      <div class="griffbild"></div>
      <div class="griffname"><span class="akkname"></span><p class="dann"></p></div>
      <div class="griffbild-dann" hidden></div>
    </section>
    <section class="text${ohneText ? " ohnetext" : ""}" aria-label="Liedtext">
      <p class="zeile vorige"></p>
      <p class="zeile aktuelle"></p>
      <p class="zeile kommende"></p>
      ${texthinweisHTML(lied, wer)}
    </section>
    <div class="schlagkopf">
      <p class="zaehler"></p>
      <div class="klangwahl" role="group" aria-label="Taktgeber">
        <button type="button" data-modus="aus" aria-pressed="false">Aus</button>
        <button type="button" data-modus="takt" aria-pressed="false">Takt</button>
        <button type="button" data-modus="schlag" aria-pressed="false">Ab/Auf</button>
      </div>
    </div>
    <section class="schlag" aria-label="Schlagmuster: ${esc(lied.schlagmuster)}"></section>
    <footer class="leiste">
      <button class="start" type="button"></button>
      <div class="tempo" role="group" aria-label="Tempo">
        <button class="langsamer" type="button" aria-label="Langsamer">${symbol("minus")}</button>
        <span class="tempowert" aria-live="polite"></span>
        <button class="schneller" type="button" aria-label="Schneller">${symbol("plus")}</button>
      </div>
      <button class="schleife umschalter" type="button" aria-pressed="false">${symbol("schleife")}<span>Schleife</span></button>
      <button class="feuermodus umschalter" type="button" aria-pressed="false">${symbol("feuer")}<span>Feuer</span></button>
    </footer>
  </article>`;
}
