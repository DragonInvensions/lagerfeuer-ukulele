/* Einmalige Uebernahme der Lieder aus der alten App (quelle/p6-songs-a.js + p7-songs-b.js)
   in Liedspur-Dateien unter lieder/. Danach sind die JSON-Dateien die Wahrheit;
   das Skript verschwindet zusammen mit quelle/, wenn die neue App die alte abloest.

   Aufruf im Ordner Ukulele:  node werkzeug/uebernahme.js

   Die alte App wusste nur, WELCHE Silben in einem Takt liegen. Sie werden deshalb
   gleichmaessig verteilt und als "geschaetzt" markiert; den echten Rhythmus tragen
   spaeter die Noten (siehe docs/entscheidungen.md). */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { FORMAT, pruefen } from "../app/kern/liedspur.js";
import { alsJson } from "./liedspur-json.js";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = path.join(WURZEL, "lieder");
const AUFTAKT_SILBE = 0.5; /* shortcut: Auftaktsilben als Achtel, bis die Noten sie genau setzen */

/* Was im alten Freitext stand und sich nicht automatisch lesen laesst */
const TEMPOKARTEN = {
  lagerfeuerlied: [{ ab: 0, bpm: 116 }, { ab: 64, bpm: 232 }],
};

function alteLiederLaden() {
  const roh = ["p6-songs-a.js", "p7-songs-b.js"]
    .map((datei) => fs.readFileSync(path.join(WURZEL, "quelle", datei), "utf8"))
    .join("\n").replace(/<\/?script>/g, "").replace(/^\s*"use strict";/m, "");
  const kontext = {};
  vm.createContext(kontext);
  vm.runInContext(roh + "\nthis.SONGS = SONGS;", kontext);
  return kontext.SONGS;
}

/* wie silbenTeilen() in quelle/p8-render.js */
function silbenTeilen(wort) {
  const teile = [];
  let aktuell = "";
  for (let i = 0; i < wort.length; i++) {
    aktuell += wort[i];
    if (wort[i] === "-" && i < wort.length - 1) { teile.push(aktuell); aktuell = ""; }
  }
  if (aktuell) teile.push(aktuell);
  return teile;
}
const ohneAkkorde = (text) => String(text || "").replace(/\[[^\]]*\]/g, "").trim();
const silbenAus = (text) => ohneAkkorde(text).split(/\s+/).filter(Boolean).flatMap(silbenTeilen);

/* Textzeile in Takte zerlegen – dieselbe Regel wie im alten Taktraster:
   ein Abschnitt mehr als Takte bedeutet Auftakt. */
function zeileZerlegen(row) {
  const abschnitte = row.x ? String(row.x).split("|").map((teil) => teil.trim()) : [];
  let auftakt = [];
  if (abschnitte.length > row.b.length) {
    const vorne = abschnitte.splice(0, abschnitte.length - row.b.length + 1);
    auftakt = vorne.slice(0, -1).flatMap(silbenAus);
    abschnitte.unshift(vorne[vorne.length - 1]);
  }
  return { auftakt, takte: row.b.map((_, i) => silbenAus(abschnitte[i] || "")) };
}

function taktart(tempoText) {
  const treffer = /(\d+)\/(\d+)/.exec(tempoText || "");
  if (!treffer) throw new Error(`keine Taktart in „${tempoText}“`);
  return [Number(treffer[1]), Number(treffer[2])];
}

function liedUebernehmen(alt) {
  const takt = taktart(alt.tempo);
  const proTakt = takt[0] * 4 / takt[1];
  const bpm = Number((/(\d+)\s*bpm/i.exec(alt.tempo) || [])[1]);
  const zeilenRoh = alt.secs.flatMap((sec) => sec.rows.map((row) => ({ sec, row, ...zeileZerlegen(row) })));

  const lied = {
    format: FORMAT, id: alt.id, titel: alt.t, untertitel: alt.sub, gemeinfrei: Boolean(alt.pd),
    stufe: alt.lvl, tonart: alt.key, takt, tempo: TEMPOKARTEN[alt.id] ?? [{ ab: 0, bpm }],
    schlagmuster: alt.strum, abschnitte: [], zeilen: [], akkorde: [], silben: [], laenge: 0,
    silbenZeit: "geschaetzt",
  };
  let position = 0, letzterAkkord = null, letzterAbschnitt = null;
  zeilenRoh.forEach((zeile, zi) => {
    if (zeile.sec !== letzterAbschnitt) { lied.abschnitte.push({ ab: position, name: zeile.sec.n }); letzterAbschnitt = zeile.sec; }
    const auftaktBeginn = position - zeile.auftakt.length * AUFTAKT_SILBE;
    lied.zeilen.push(zeile.auftakt.length ? auftaktBeginn : position);
    zeile.auftakt.forEach((text, i) => lied.silben.push({ ab: auftaktBeginn + i * AUFTAKT_SILBE, lang: AUFTAKT_SILBE, text }));
    const naechsterAuftakt = (zeilenRoh[zi + 1]?.auftakt.length ?? 0) * AUFTAKT_SILBE;
    zeile.row.b.forEach((akkord, ti) => {
      if (akkord !== "" && akkord !== letzterAkkord) { lied.akkorde.push({ ab: position, akk: akkord }); letzterAkkord = akkord; }
      /* der letzte Takt einer Zeile macht Platz fuer den Auftakt der naechsten */
      const platz = proTakt - (ti === zeile.row.b.length - 1 ? naechsterAuftakt : 0);
      const silben = zeile.takte[ti];
      /* Laenge aus den gerundeten Anfaengen, sonst ragt jede Drittel-Silbe um ein Tausendstel in die naechste */
      const anfaenge = silben.map((_, i) => runden(position + i * platz / silben.length)).concat(runden(position + platz));
      silben.forEach((text, i) => lied.silben.push({ ab: anfaenge[i], lang: runden(anfaenge[i + 1] - anfaenge[i]), text }));
      position += proTakt;
    });
  });
  lied.laenge = position;
  zusatzAngabenUebernehmen(alt, lied);
  return lied;
}

function zusatzAngabenUebernehmen(alt, lied) {
  if (alt.note) lied.hinweis = alt.note;
  if (alt.src) lied.quellen = alt.src;
  if (alt.verified) lied.akkordeGeprueft = true;
  if (alt.star) lied.stern = true;
  if (alt.textsuche) lied.textsuche = alt.textsuche;
  if (alt.texthinweis) lied.texthinweis = alt.texthinweis;
}

const runden = (zahl) => Math.round(zahl * 1000) / 1000;

const alteLieder = alteLiederLaden();
fs.mkdirSync(ZIEL, { recursive: true });
let fehlerGesamt = 0;
for (const alt of alteLieder) {
  const lied = liedUebernehmen(alt);
  const fehler = pruefen(lied);
  if (fehler.length) { fehlerGesamt += fehler.length; console.error(`${lied.id}:`, fehler); }
  fs.writeFileSync(path.join(ZIEL, `${lied.id}.json`), alsJson(lied));
}
console.log(`${alteLieder.length} Lieder nach lieder/ geschrieben, ${fehlerGesamt} Fehler.`);
process.exitCode = fehlerGesamt ? 1 : 0;
