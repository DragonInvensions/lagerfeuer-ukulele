/* Private Textablage: je geschuetztem Lied eine Textspur unter <Daten>/texte/<id>.json.
   Der Ordner liegt ausserhalb des Repos; ausgeliefert wird nur nach Anmeldung (server.js). */
import fs from "node:fs/promises";
import path from "node:path";
import { FORMAT_TEXTSPUR, textspurAnwenden } from "../app/kern/textspur.js";
import { pruefen } from "../app/kern/liedspur.js";

const ID = /^[a-z0-9-]+$/;
const GRENZEN = { silben: 4000, zeichenJeSilbe: 40 };

export function texteAblage(ordner) {
  const verzeichnis = path.join(ordner, "texte");
  const datei = (id) => {
    if (!ID.test(id)) throw new Error("ungueltige Lied-Id");
    return path.join(verzeichnis, `${id}.json`);
  };

  return {
    async lesen(id) {
      try {
        return JSON.parse(await fs.readFile(datei(id), "utf8"));
      } catch (fehler) {
        if (fehler.code === "ENOENT") return null;
        throw fehler;
      }
    },
    async vorhandene() {
      try {
        return (await fs.readdir(verzeichnis)).filter((name) => name.endsWith(".json")).map((name) => name.slice(0, -5));
      } catch (fehler) {
        if (fehler.code === "ENOENT") return [];
        throw fehler;
      }
    },
    async schreiben(id, spur) {
      await fs.mkdir(verzeichnis, { recursive: true });
      const ziel = datei(id), zwischen = `${ziel}.tmp`;
      await fs.writeFile(zwischen, JSON.stringify(spur));
      await fs.rename(zwischen, ziel);
    },
  };
}

/* Alles, was von aussen kommt, wird gegen das oeffentliche Lied geprueft. Rueckgabe: Fehlerliste. */
export function textspurPruefen(lied, spur) {
  if (!spur || typeof spur !== "object") return ["keine Textspur"];
  const fehler = [];
  if (spur.format !== FORMAT_TEXTSPUR) fehler.push(`Format muss ${FORMAT_TEXTSPUR} sein`);
  if (spur.lied !== lied.id) fehler.push("Textspur gehoert zu einem anderen Lied");
  if (!Array.isArray(spur.silben) || !Array.isArray(spur.zeilen)) return [...fehler, "silben und zeilen fehlen"];
  if (spur.silben.length > GRENZEN.silben) fehler.push("zu viele Silben");
  if (spur.zeilen.length !== lied.zeilen.length) fehler.push(`Das Lied hat ${lied.zeilen.length} Zeilen, die Textspur ${spur.zeilen.length}`);
  for (const silbe of spur.silben) {
    if (typeof silbe?.text !== "string" || silbe.text.length > GRENZEN.zeichenJeSilbe || !Number.isFinite(silbe.ab) || !Number.isFinite(silbe.lang)) {
      fehler.push("ungueltige Silbe");
      break;
    }
  }
  if (fehler.length) return fehler;
  return pruefen(textspurAnwenden(lied, spur));
}
