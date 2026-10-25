/* Setzt den Silben-Rhythmus eines Liedes nach einer Notenvorlage aus werkzeug/noten/<id>.json.
   Takte und Akkorde bleiben, nur Anfang und Laenge jeder Silbe werden neu gesetzt.

   Aufruf im Ordner Ukulele:  node werkzeug/rhythmus.js <id>

   Vorlage: { "quelle": {t, u}, "muster": { "A": "1 1 2 | 1 1 2", ... }, "zeilen": ["A", ...] }
   Im Muster ist jede Zahl die Dauer einer Silbe in Vierteln (auch 1/2 oder 1/3), "p2" eine Pause
   von zwei Vierteln, "~2" haelt die vorige Silbe ueber den Taktstrich zwei Viertel weiter (Haltebogen),
   "|" ein Taktstrich (jeder Takt muss voll sein). Was vor "^" steht, ist der Auftakt und endet
   genau auf dem ersten Taktstrich der Zeile. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { viertelProTakt, silbenDerZeile, pruefen } from "../app/kern/liedspur.js";
import { alsJson } from "./liedspur-json.js";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function zahl(text) {
  const [zaehler, nenner] = text.split("/").map(Number);
  const wert = nenner ? zaehler / nenner : zaehler;
  if (!(wert > 0)) throw new Error(`keine Dauer: „${text}“`);
  return wert;
}

/* "1 1 2 | p4" -> { auftakt: [], takte: [[{lang:1},...], [{pause:4}]] } */
export function musterLesen(muster, proTakt) {
  const [vorne, hinten] = muster.includes("^") ? muster.split("^") : ["", muster];
  const eintraege = (teil) => teil.trim().split(/\s+/).filter(Boolean)
    .map((zeichen) => {
      if (zeichen.startsWith("p")) return { pause: zahl(zeichen.slice(1)) };
      if (zeichen.startsWith("~")) return { halten: zahl(zeichen.slice(1)) };
      return { lang: zahl(zeichen) };
    });
  const takte = hinten.split("|").map(eintraege);
  takte.forEach((takt, i) => {
    const summe = takt.reduce((s, e) => s + (e.lang ?? e.pause ?? e.halten), 0);
    if (Math.abs(summe - proTakt) > 1e-6) throw new Error(`Takt ${i + 1} von „${muster}“ hat ${summe} statt ${proTakt} Viertel`);
  });
  return { auftakt: eintraege(vorne), takte };
}

export function rhythmusSetzen(lied, vorlage) {
  const proTakt = viertelProTakt(lied);
  if (vorlage.zeilen.length !== lied.zeilen.length) {
    throw new Error(`Vorlage hat ${vorlage.zeilen.length} Zeilen, das Lied ${lied.zeilen.length}`);
  }
  const neueSilben = [], neueZeilen = [];
  lied.zeilen.forEach((start, index) => {
    const muster = musterLesen(vorlage.muster[vorlage.zeilen[index]], proTakt);
    const silben = silbenDerZeile(lied, index);
    const dauern = [...muster.auftakt, ...muster.takte.flat()].filter((e) => e.lang);
    if (dauern.length !== silben.length) {
      throw new Error(`Zeile ${index + 1}: ${silben.length} Silben, Muster ${vorlage.zeilen[index]} hat ${dauern.length}`);
    }
    /* Taktanfang der Zeile: der Auftakt der alten Daten liegt davor im vorigen Takt */
    const taktanfang = Math.ceil(start / proTakt - 1e-9) * proTakt;
    let position = taktanfang - muster.auftakt.reduce((s, e) => s + e.lang, 0);
    let silbe = 0;
    neueZeilen.push(position);
    for (const eintrag of [...muster.auftakt, ...muster.takte.flat()]) {
      if (eintrag.lang) neueSilben.push({ ab: runden(position), lang: runden(eintrag.lang), text: silben[silbe++].text });
      if (eintrag.halten) {
        const vorige = neueSilben[neueSilben.length - 1];
        if (!vorige) throw new Error(`Zeile ${index + 1}: Haltebogen ohne Silbe davor`);
        vorige.lang = runden(vorige.lang + eintrag.halten);
      }
      position += eintrag.lang ?? eintrag.pause ?? eintrag.halten;
    }
  });
  const quellen = (lied.quellen ?? []).filter((quelle) => quelle.u !== vorlage.quelle.u);
  return { ...lied, zeilen: neueZeilen, silben: neueSilben, silbenZeit: "aus-noten", quellen: [...quellen, vorlage.quelle] };
}

const runden = (wert) => Math.round(wert * 1000) / 1000 + 0; /* + 0 macht aus -0 eine 0 */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const id = process.argv[2];
  const datei = path.join(WURZEL, "lieder", `${id}.json`);
  const lied = JSON.parse(fs.readFileSync(datei, "utf8"));
  const vorlage = JSON.parse(fs.readFileSync(path.join(WURZEL, "werkzeug", "noten", `${id}.json`), "utf8"));
  const neu = rhythmusSetzen(lied, vorlage);
  const fehler = pruefen(neu);
  if (fehler.length) { console.error(fehler); process.exit(1); }
  fs.writeFileSync(datei, alsJson(neu));
  console.log(`${id}: ${neu.silben.length} Silben nach Noten gesetzt.`);
}
