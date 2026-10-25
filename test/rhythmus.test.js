import { test } from "node:test";
import assert from "node:assert/strict";
import { musterLesen, rhythmusSetzen } from "../werkzeug/rhythmus.js";
import { FORMAT, pruefen } from "../app/kern/liedspur.js";

test("Muster: Dauern, Pausen, Bruchteile und Auftakt", () => {
  const muster = musterLesen("1/2 1/2 ^ 1 1 2 | 2 p2", 4);
  assert.deepEqual(muster.auftakt, [{ lang: 0.5 }, { lang: 0.5 }]);
  assert.deepEqual(muster.takte, [[{ lang: 1 }, { lang: 1 }, { lang: 2 }], [{ lang: 2 }, { pause: 2 }]]);
  assert.throws(() => musterLesen("1 1 1 | 4", 4), /hat 3 statt 4/);
  assert.deepEqual(musterLesen("3 | ~2 p1", 3).takte, [[{ lang: 3 }], [{ halten: 2 }, { pause: 1 }]]);
});

test("Haltebogen verlaengert die Silbe ueber den Taktstrich", () => {
  const lied = {
    format: FORMAT, id: "probe", titel: "Probe", takt: [3, 4], tempo: [{ ab: 0, bpm: 90 }], laenge: 6,
    silbenZeit: "geschaetzt", zeilen: [0], akkorde: [{ ab: 0, akk: "C" }],
    silben: [{ ab: 0, lang: 3, text: "me" }],
  };
  const neu = rhythmusSetzen(lied, { quelle: { t: "Rhythmus nach Probe", u: "https://example.org" }, muster: { A: "3 | ~2 p1" }, zeilen: ["A"] });
  assert.deepEqual(neu.silben, [{ ab: 0, lang: 5, text: "me" }]);
});

test("Rhythmus setzen: Auftakt endet auf dem Taktstrich, Pausen verschieben", () => {
  const lied = {
    format: FORMAT, id: "probe", titel: "Probe", takt: [4, 4], tempo: [{ ab: 0, bpm: 90 }], laenge: 8,
    silbenZeit: "geschaetzt", zeilen: [-1], akkorde: [{ ab: 0, akk: "C" }],
    silben: ["Muss", "i", "denn", "zum", "Tor"].map((text, i) => ({ ab: -1 + i, lang: 1, text })),
  };
  const vorlage = { quelle: { t: "Rhythmus nach Probe", u: "https://example.org" }, muster: { A: "1/2 1/2 ^ 2 p1 1 | 4" }, zeilen: ["A"] };
  const neu = rhythmusSetzen(lied, vorlage);
  assert.deepEqual(neu.silben.map((silbe) => [silbe.text, silbe.ab, silbe.lang]),
    [["Muss", -1, 0.5], ["i", -0.5, 0.5], ["denn", 0, 2], ["zum", 3, 1], ["Tor", 4, 4]]);
  assert.deepEqual(neu.zeilen, [-1]);
  assert.equal(neu.silbenZeit, "aus-noten");
  assert.deepEqual(pruefen(neu), []);
  assert.throws(() => rhythmusSetzen(lied, { ...vorlage, muster: { A: "1 1 2 | 4" } }), /5 Silben/);
});
