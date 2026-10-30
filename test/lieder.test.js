/* Alle Lieder im oeffentlichen Ordner muessen gueltig sein – und duerfen keinen geschuetzten Text enthalten.
   Dieser Test ist der Waechter aus docs/entscheidungen.md: Lieder mit Text, die nicht gemeinfrei sind,
   gehoeren auf Jarvis, nie ins oeffentliche Repo. */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pruefen } from "../app/kern/liedspur.js";
import { griff } from "../app/kern/griffe.js";
import { SCHLAGMUSTER } from "../app/kern/schlagmuster.js";

const ORDNER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "lieder");
const dateien = fs.readdirSync(ORDNER).filter((datei) => datei.endsWith(".json"));

test("es gibt Lieder", () => assert.ok(dateien.length > 0));

for (const datei of dateien) {
  const lied = JSON.parse(fs.readFileSync(path.join(ORDNER, datei), "utf8"));

  test(`${datei}: gueltige Liedspur`, () => {
    assert.deepEqual(pruefen(lied), []);
    assert.equal(`${lied.id}.json`, datei, "Dateiname muss der id entsprechen");
  });

  test(`${datei}: jeder Akkord hat ein Griffbild, das Schlagmuster ist bekannt`, () => {
    assert.deepEqual(lied.akkorde.map((akkord) => akkord.akk).filter((name) => !griff(name)), []);
    assert.ok(SCHLAGMUSTER.some((muster) => muster.name === lied.schlagmuster), `unbekanntes Schlagmuster ${lied.schlagmuster}`);
  });

  test(`${datei}: Rhythmus aus Noten nennt seine Quelle`, () => {
    if (lied.silbenZeit !== "aus-noten") return;
    assert.ok((lied.quellen ?? []).some((quelle) => /Rhythmus/.test(quelle.t)), "aus-noten braucht eine Rhythmus-Quelle");
  });

  test(`${datei}: kein geschuetzter Text im oeffentlichen Ordner`, () => {
    if (lied.gemeinfrei === true) return;
    assert.equal(lied.silben.filter((silbe) => silbe.text.trim()).length, 0,
      "Lied ist nicht gemeinfrei, hat aber Text – gehoert auf Jarvis, nicht ins Repo");
  });
}

/* Fehler aus der alten App: „schwimmen auf dem See“ war auf halbe Laenge gestaucht.
   In der Melodie haben „Al-le mei-ne“ und „schwim-men auf dem“ denselben Notenwert. */
test("Alle meine Entchen: gleiche Notenwerte bleiben gleich lang", () => {
  const entchen = JSON.parse(fs.readFileSync(path.join(ORDNER, "entchen.json"), "utf8"));
  const erste = (text) => entchen.silben.find((silbe) => silbe.text === text);
  assert.equal(erste("schwim-").lang, erste("Al-").lang);
  assert.equal(erste("See,").ab - erste("schwim-").ab, erste("Ent-").ab - erste("Al-").ab);
});

test("Geschuetzte Lieder verweisen auf Textseiten, nur ueber https", () => {
  for (const datei of dateien) {
    const lied = JSON.parse(fs.readFileSync(path.join(ORDNER, datei), "utf8"));
    if (lied.gemeinfrei) continue;
    assert.ok(lied.textquellen?.length, `${datei}: keine Textseite`);
    for (const adresse of lied.textquellen) assert.match(adresse, /^https:\/\/[^\s"<>]+$/, datei);
  }
});
