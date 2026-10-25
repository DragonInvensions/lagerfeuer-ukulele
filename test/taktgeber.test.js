import { test } from "node:test";
import assert from "node:assert/strict";
import { klangAufAchtel } from "../app/kern/taktgeber.js";
import { schlagmusterNamens } from "../app/kern/schlagmuster.js";

const vierViertel = { takt: [4, 4] }, dreiViertel = { takt: [3, 4] };
const klaenge = (lied, muster, modus, von, bis) =>
  Array.from({ length: bis - von }, (_, i) => klangAufAchtel(lied, muster, modus, von + i))
    .map((klang) => (klang ? `${klang.art}${klang.betont ? "!" : ""}` : "-"));

test("Takt-Modus: Klick auf jedem Viertel, die Eins betont", () => {
  assert.deepEqual(klaenge(vierViertel, schlagmusterNamens("Der Klassiker"), "takt", 0, 8),
    ["klick!", "-", "klick", "-", "klick", "-", "klick", "-"]);
});

test("Schlag-Modus: ab und auf nach dem Muster, Pausen still", () => {
  /* Der Klassiker: D - D U - U D U */
  assert.deepEqual(klaenge(vierViertel, schlagmusterNamens("Der Klassiker"), "schlag", 0, 8),
    ["ab!", "-", "ab", "auf", "-", "auf", "ab", "auf"]);
  /* Chunk: D - x - D - x - */
  assert.deepEqual(klaenge(vierViertel, schlagmusterNamens("Chunk"), "schlag", 8, 12), ["ab!", "-", "chunk", "-"]);
});

test("3/4: das Muster beginnt in jedem Takt neu", () => {
  /* Walzer: D - D U D U */
  assert.deepEqual(klaenge(dreiViertel, schlagmusterNamens("Walzer"), "schlag", 6, 12), ["ab!", "-", "ab", "auf", "ab", "auf"]);
});

test("Einzaehlen ist immer Takt, aus ist still", () => {
  assert.deepEqual(klaenge(vierViertel, schlagmusterNamens("Achtel durch"), "schlag", -8, 0),
    ["klick!", "-", "klick", "-", "klick", "-", "klick", "-"]);
  assert.deepEqual(klaenge(vierViertel, schlagmusterNamens("Achtel durch"), "aus", -2, 2), ["-", "-", "-", "-"]);
});
