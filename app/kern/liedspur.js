/* Liedspur: das Liedmodell der App, ohne Oberflaeche und ohne Netz.

   Alle Positionen sind Viertel ab der Eins von Takt 1; ein Auftakt ist negativ.
   Sekunden entstehen erst hier, ueber die Tempokarte. Was sich ableiten laesst
   (Akkorddauer, Taktnummer, Griffliste), wird nie gespeichert, sondern hier berechnet. */

export const FORMAT = "liedspur/1";
export const SILBENZEITEN = ["geschaetzt", "aus-noten", "aus-ultrastar", "aus-aufnahme"];

export function viertelProTakt(lied) {
  const [zaehler, nenner] = lied.takt;
  return zaehler * 4 / nenner;
}

/* Takt 1 beginnt bei 0; der Auftakt liegt in Takt 0. Schlag zaehlt in Vierteln ab 1. */
export function taktUndSchlag(lied, position) {
  const proTakt = viertelProTakt(lied);
  const takt = Math.floor(position / proTakt) + 1;
  const imTakt = position - (takt - 1) * proTakt;
  return { takt, schlag: Math.floor(imTakt + 1e-9) + 1 };
}

/* Tempokarte in Abschnitte mit fester Dauer je Viertel zerlegen. */
function tempoAbschnitte(lied, tempoFaktor) {
  return lied.tempo.map((eintrag, i) => ({
    ab: i === 0 ? -Infinity : eintrag.ab,
    bis: i + 1 < lied.tempo.length ? lied.tempo[i + 1].ab : Infinity,
    sekundenProViertel: 60 / (eintrag.bpm * tempoFaktor),
  }));
}

/* Sekunden ab Position 0 (Auftakt ergibt negative Sekunden). */
export function sekundeBei(lied, position, tempoFaktor = 1) {
  const abschnitte = tempoAbschnitte(lied, tempoFaktor);
  if (position < 0) return position * abschnitte[0].sekundenProViertel;
  let sekunden = 0;
  for (const abschnitt of abschnitte) {
    const von = Math.max(abschnitt.ab, 0), bis = Math.min(abschnitt.bis, position);
    if (bis > von) sekunden += (bis - von) * abschnitt.sekundenProViertel;
  }
  return sekunden;
}

export function positionBei(lied, sekunde, tempoFaktor = 1) {
  const abschnitte = tempoAbschnitte(lied, tempoFaktor);
  if (sekunde < 0) return sekunde / abschnitte[0].sekundenProViertel;
  let rest = sekunde;
  for (const abschnitt of abschnitte) {
    const von = Math.max(abschnitt.ab, 0);
    const dauer = (abschnitt.bis - von) * abschnitt.sekundenProViertel;
    if (rest <= dauer) return von + rest / abschnitt.sekundenProViertel;
    rest -= dauer;
  }
  return Infinity;
}

/* Letzter Akkordwechsel bis einschliesslich position; vor dem ersten Wechsel der erste Akkord. */
export function akkordBei(lied, position) {
  let aktuell = lied.akkorde[0];
  for (const akkord of lied.akkorde) {
    if (akkord.ab > position) break;
    aktuell = akkord;
  }
  return aktuell;
}

export function naechsterAkkord(lied, position) {
  return lied.akkorde.find((akkord) => akkord.ab > position) ?? null;
}

export function akkordDauer(lied, index) {
  const ende = index + 1 < lied.akkorde.length ? lied.akkorde[index + 1].ab : lied.laenge;
  return ende - lied.akkorde[index].ab;
}

/* Alle Griffe, die das Lied braucht, in der Reihenfolge des ersten Auftretens. */
export function griffe(lied, halbtoene = 0) {
  return [...new Set(lied.akkorde.map((akkord) => transponiere(akkord.akk, halbtoene)))];
}

/* Eine Zeile beginnt mit ihrer ersten Silbe, also samt Auftakt mitten im Takt.
   Zeilen ohne Text (geschuetzte Lieder) beginnen auf ihrem ersten Takt. */
export function zeileBei(lied, position) {
  let index = 0;
  lied.zeilen.forEach((start, i) => { if (start <= position) index = i; });
  return index;
}

export function zeilenEnde(lied, index) {
  return index + 1 < lied.zeilen.length ? lied.zeilen[index + 1] : lied.laenge;
}

/* Zu jeder Zeile der Abschnitt (Strophe, Refrain, …), in dem sie beginnt; null ohne Abschnitte */
export function abschnittDerZeilen(lied) {
  const abschnitte = lied.abschnitte ?? [];
  return lied.zeilen.map((start) => abschnitte.findLast((abschnitt) => abschnitt.ab <= start + 1e-9) ?? null);
}

export function silbenDerZeile(lied, index) {
  const von = lied.zeilen[index], bis = zeilenEnde(lied, index);
  return lied.silben.filter((silbe) => silbe.ab >= von && silbe.ab < bis);
}

/* ---------- Transponieren (aus der alten App, p5-core.js) ---------- */
const KREUZ = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCHOEN = { "A#": "Bb", "D#": "Eb", "G#": "Ab" };
const TONSTUFE = { C: 0, "C#": 1, DB: 1, D: 2, "D#": 3, EB: 3, E: 4, FB: 4, F: 5, "E#": 5,
  "F#": 6, GB: 6, G: 7, "G#": 8, AB: 8, A: 9, "A#": 10, BB: 10, B: 11, CB: 11 };

export function transponiere(akkord, halbtoene) {
  if (!akkord || !halbtoene) return akkord;
  const treffer = /^([A-G][#b]?)(.*)$/.exec(akkord);
  if (!treffer) return akkord;
  const stufe = TONSTUFE[treffer[1].toUpperCase()];
  if (stufe === undefined) return akkord;
  const neu = KREUZ[((stufe + halbtoene) % 12 + 12) % 12];
  return (SCHOEN[neu] ?? neu) + treffer[2];
}

/* ---------- Pruefung: jede Liedspur, die die App laedt, muss das bestehen ---------- */
export function pruefen(lied) {
  const fehler = [];
  const pflicht = ["id", "titel", "takt", "tempo", "zeilen", "akkorde", "silben", "laenge", "silbenZeit"];
  for (const feld of pflicht) if (lied[feld] === undefined) fehler.push(`Feld fehlt: ${feld}`);
  if (fehler.length) return fehler;
  if (lied.format !== FORMAT) fehler.push(`Format ist ${lied.format}, erwartet ${FORMAT}`);
  if (!SILBENZEITEN.includes(lied.silbenZeit)) fehler.push(`unbekannte silbenZeit: ${lied.silbenZeit}`);
  if (!lied.tempo.length || lied.tempo[0].ab !== 0) fehler.push("Tempokarte muss bei 0 beginnen");
  if (!lied.akkorde.length) fehler.push("keine Akkorde");
  aufsteigend(lied.tempo, "Tempokarte", fehler);
  aufsteigend(lied.akkorde, "Akkorde", fehler);
  aufsteigend(lied.silben, "Silben", fehler);
  aufsteigend(lied.zeilen.map((ab) => ({ ab })), "Zeilen", fehler);
  if (lied.silben.length && lied.silben[0].ab < lied.zeilen[0]) fehler.push("Silben vor der ersten Zeile");
  lied.silben.forEach((silbe, i) => {
    if (!(silbe.lang > 0)) fehler.push(`Silbe ${i} „${silbe.text}“ hat keine Laenge`);
    const naechste = lied.silben[i + 1];
    if (naechste && silbe.ab + silbe.lang > naechste.ab + 1e-6) fehler.push(`Silbe ${i} „${silbe.text}“ ueberlappt die naechste`);
    if (silbe.ab + silbe.lang > lied.laenge + 1e-6) fehler.push(`Silbe ${i} „${silbe.text}“ endet nach dem Lied`);
  });
  const letzterAkkord = lied.akkorde[lied.akkorde.length - 1];
  if (letzterAkkord && letzterAkkord.ab >= lied.laenge) fehler.push("letzter Akkord beginnt nach dem Liedende");
  return fehler;
}

function aufsteigend(liste, name, fehler) {
  for (let i = 1; i < liste.length; i++) {
    if (liste[i].ab < liste[i - 1].ab) fehler.push(`${name} nicht aufsteigend bei Eintrag ${i}`);
  }
}
