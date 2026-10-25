import { test } from "node:test";
import assert from "node:assert/strict";
import { rundenAnlegen, standAusEingabe } from "../server/runden.js";

const gueltig = { lied: "entchen", position: 4.5, faktor: 0.75, laeuft: true };

test("Stand: nur rechenbare Werte kommen durch", () => {
  assert.deepEqual(standAusEingabe({ ...gueltig, serverZeit: 1000 }, 1500).stand, { ...gueltig, serverZeit: 1000 });
  for (const falsch of [{ lied: "../geheim" }, { lied: 7 }, { position: NaN }, { position: "4" }, { position: 1e9 },
    { faktor: 0 }, { faktor: 3 }, { laeuft: "ja" }]) {
    assert.ok(standAusEingabe({ ...gueltig, ...falsch }, 0).fehler, JSON.stringify(falsch));
  }
  assert.ok(standAusEingabe(null, 0).fehler);
});

test("Stand: eine Zeit weit neben der Server-Uhr wird durch den Eingang ersetzt", () => {
  assert.equal(standAusEingabe({ ...gueltig, serverZeit: 1000 }, 60_000).stand.serverZeit, 60_000);
  assert.equal(standAusEingabe(gueltig, 60_000).stand.serverZeit, 60_000);
});

test("Runde: melden erreicht alle Zuhoerer, beenden schliesst sie", () => {
  const runden = rundenAnlegen();
  const token = runden.anlegen("entchen");
  assert.match(token, /^[A-Za-z0-9_-]{22}$/);
  const gehoert = [];
  let beendet = 0;
  const abmelden = runden.zuhoeren(token, { senden: (stand) => gehoert.push(stand.position), ende: () => beendet++ });
  runden.melden(token, { ...gueltig, position: 8, serverZeit: 0 });
  assert.deepEqual(gehoert, [8]);
  abmelden();
  runden.melden(token, { ...gueltig, position: 9, serverZeit: 0 });
  assert.deepEqual(gehoert, [8], "abgemeldet hoert nichts mehr");
  runden.zuhoeren(token, { senden: () => {}, ende: () => beendet++ });
  assert.equal(runden.beenden(token), true);
  assert.equal(beendet, 1);
  assert.equal(runden.stand(token), null);
  assert.equal(runden.melden(token, gueltig), false);
});

test("Runde: hoechstens drei, die aelteste weicht; nach sechs Stunden Ruhe ist sie vorbei", () => {
  let uhr = 0;
  const runden = rundenAnlegen({ jetzt: () => uhr });
  const tokens = ["a", "b", "c", "d"].map(() => runden.anlegen("entchen"));
  assert.equal(runden.stand(tokens[0]), null);
  assert.ok(runden.stand(tokens[3]));
  uhr = 5 * 60 * 60 * 1000;
  runden.melden(tokens[3], { ...gueltig, serverZeit: uhr });
  uhr = 7 * 60 * 60 * 1000;
  assert.equal(runden.stand(tokens[1]), null);
  assert.ok(runden.stand(tokens[3]), "gemeldet vor zwei Stunden, laeuft noch");
});

test("Runde: hoechstens 30 Zuhoerer", () => {
  const runden = rundenAnlegen();
  const token = runden.anlegen("entchen");
  for (let i = 0; i < 30; i++) assert.equal(typeof runden.zuhoeren(token, { senden() {}, ende() {} }), "function");
  assert.equal(runden.zuhoeren(token, { senden() {}, ende() {} }), "voll");
  assert.equal(runden.zuhoeren("gibtsnicht", { senden() {}, ende() {} }), null);
});
