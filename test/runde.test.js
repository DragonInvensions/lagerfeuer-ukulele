import { test } from "node:test";
import assert from "node:assert/strict";
import { positionNach, uhrVersatz } from "../app/kern/runde.js";

/* 120 bpm, ab Takt 3 (Viertel 8) 60 bpm */
const lied = { takt: [4, 4], tempo: [{ ab: 0, bpm: 120 }, { ab: 8, bpm: 60 }], laenge: 16 };

test("Angehalten: die gemeldete Stelle gilt, egal wie viel Zeit vergeht", () => {
  assert.equal(positionNach(lied, { position: 5, faktor: 1, laeuft: false, serverZeit: 1000 }, 99_000), 5);
});

test("Laufend: weiterrechnen ueber die Tempo-Karte, auch ueber einen Tempowechsel", () => {
  const stand = { position: 6, faktor: 1, laeuft: true, serverZeit: 10_000 };
  assert.equal(positionNach(lied, stand, 10_500), 7);
  /* 1 s bis Viertel 8, dann 1 s bei 60 bpm = 1 Viertel */
  assert.equal(positionNach(lied, stand, 12_000), 9);
});

test("Uebungstempo verlangsamt auch bei den Freunden", () => {
  assert.equal(positionNach(lied, { position: 0, faktor: 0.5, laeuft: true, serverZeit: 0 }, 1000), 1);
});

test("Einzaehlen: negative Stellen laufen auf die Eins zu", () => {
  assert.equal(positionNach(lied, { position: -4, faktor: 1, laeuft: true, serverZeit: 0 }, 1500), -1);
});

test("Ein Stand aus der Zukunft (Uhren leicht daneben) springt nicht zurueck", () => {
  assert.equal(positionNach(lied, { position: 3, faktor: 1, laeuft: true, serverZeit: 5000 }, 4900), 3);
});

test("Uhrversatz aus der Probe mit der kuerzesten Laufzeit", () => {
  const proben = [
    { gesendet: 1000, empfangen: 1400, serverZeit: 51_150 },
    { gesendet: 2000, empfangen: 2040, serverZeit: 52_020 },
    { gesendet: 3000, empfangen: 3300, serverZeit: 53_250 },
  ];
  assert.equal(uhrVersatz(proben), 50_000);
});
