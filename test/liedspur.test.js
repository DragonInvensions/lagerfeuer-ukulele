import { test } from "node:test";
import assert from "node:assert/strict";
import {
  viertelProTakt, taktUndSchlag, sekundeBei, positionBei, akkordBei, naechsterAkkord,
  akkordDauer, griffe, zeileBei, silbenDerZeile, transponiere, pruefen, FORMAT,
} from "../app/kern/liedspur.js";

function lied(teile = {}) {
  return {
    format: FORMAT, id: "probe", titel: "Probe", takt: [4, 4], tempo: [{ ab: 0, bpm: 120 }],
    zeilen: [-1, 8], laenge: 16, silbenZeit: "aus-noten",
    akkorde: [{ ab: 0, akk: "C" }, { ab: 8, akk: "G7" }, { ab: 12, akk: "C" }],
    silben: [{ ab: -1, lang: 1, text: "Und" }, { ab: 0, lang: 2, text: "los" }, { ab: 8, lang: 4, text: "geht's" }],
    ...teile,
  };
}

test("Viertel je Takt: 4/4, 3/4 und 6/8", () => {
  assert.equal(viertelProTakt(lied()), 4);
  assert.equal(viertelProTakt(lied({ takt: [3, 4] })), 3);
  assert.equal(viertelProTakt(lied({ takt: [6, 8] })), 3);
});

test("Takt und Schlag, Auftakt liegt in Takt 0", () => {
  assert.deepEqual(taktUndSchlag(lied(), 0), { takt: 1, schlag: 1 });
  assert.deepEqual(taktUndSchlag(lied(), 5.5), { takt: 2, schlag: 2 });
  assert.deepEqual(taktUndSchlag(lied(), -1), { takt: 0, schlag: 4 });
  assert.deepEqual(taktUndSchlag(lied({ takt: [3, 4] }), 3), { takt: 2, schlag: 1 });
});

test("Sekunden und Position: Tempokarte mit Verdopplung wie im Lagerfeuerlied", () => {
  const lagerfeuer = lied({ tempo: [{ ab: 0, bpm: 116 }, { ab: 64, bpm: 232 }], laenge: 144 });
  assert.equal(sekundeBei(lagerfeuer, 64), 64 * 60 / 116);
  assert.equal(sekundeBei(lagerfeuer, 80), 64 * 60 / 116 + 16 * 60 / 232);
  for (const position of [-2, 0, 10.5, 64, 99.25]) {
    assert.ok(Math.abs(positionBei(lagerfeuer, sekundeBei(lagerfeuer, position)) - position) < 1e-9, `hin und zurueck bei ${position}`);
  }
});

test("Tempo-Regler: halbes Tempo heisst doppelte Zeit", () => {
  assert.equal(sekundeBei(lied(), 8, 0.5), 2 * sekundeBei(lied(), 8));
  assert.equal(sekundeBei(lied(), -1), -0.5);
});

test("Akkord bei einer Position, naechster Wechsel und abgeleitete Dauer", () => {
  assert.equal(akkordBei(lied(), -1).akk, "C");
  assert.equal(akkordBei(lied(), 8).akk, "G7");
  assert.equal(naechsterAkkord(lied(), 9).akk, "C");
  assert.equal(naechsterAkkord(lied(), 12), null);
  assert.deepEqual([0, 1, 2].map((i) => akkordDauer(lied(), i)), [8, 4, 4]);
  assert.deepEqual(griffe(lied()), ["C", "G7"]);
  assert.deepEqual(griffe(lied(), 2), ["D", "A7"]);
});

test("Zeilen beginnen mit ihrer ersten Silbe, auch im Auftakt", () => {
  assert.equal(zeileBei(lied(), -1), 0);
  assert.equal(zeileBei(lied(), 7.9), 0);
  assert.deepEqual(silbenDerZeile(lied(), 0).map((silbe) => silbe.text), ["Und", "los"]);
  assert.deepEqual(silbenDerZeile(lied(), 1).map((silbe) => silbe.text), ["geht's"]);
});

test("Transponieren wie in der alten App", () => {
  assert.equal(transponiere("C", 2), "D");
  assert.equal(transponiere("Am", 3), "Cm");
  assert.equal(transponiere("G7", 3), "Bb7");
  assert.equal(transponiere("F", -1), "E");
  assert.equal(transponiere("C", 0), "C");
});

test("Pruefung findet kaputte Liedspuren", () => {
  assert.deepEqual(pruefen(lied()), []);
  assert.match(pruefen(lied({ silben: [{ ab: 0, lang: 3, text: "zu" }, { ab: 2, lang: 1, text: "lang" }] })).join(), /ueberlappt/);
  assert.match(pruefen(lied({ akkorde: [{ ab: 4, akk: "C" }, { ab: 0, akk: "G" }] })).join(), /nicht aufsteigend/);
  assert.match(pruefen(lied({ silbenZeit: "geraten" })).join(), /silbenZeit/);
  assert.match(pruefen(lied({ zeilen: [0, 8] })).join(), /vor der ersten Zeile/);
  assert.match(pruefen({ id: "leer" }).join(), /Feld fehlt/);
});
