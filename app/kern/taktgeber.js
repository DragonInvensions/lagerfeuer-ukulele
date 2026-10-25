/* Was der Taktgeber auf einem Achtel spielt.
   "takt":   ein Klick auf jedem Viertel, die Eins betont.
   "schlag": der Schlag des Schlagmusters – ab, auf oder Chunk; Pausen bleiben still.
   "aus":    nichts.
   Eingezaehlt wird in jedem Modus ausser "aus" mit Takt-Klicks, damit der Einsatz klar ist. */
import { viertelProTakt } from "./liedspur.js";

export const KLANGMODI = ["aus", "takt", "schlag"];
const SCHLAGKLANG = { D: "ab", U: "auf", x: "chunk" };

export function klangAufAchtel(lied, muster, modus, achtel) {
  if (modus === "aus") return null;
  const achtelProTakt = viertelProTakt(lied) * 2;
  const imTakt = ((achtel % achtelProTakt) + achtelProTakt) % achtelProTakt;
  const betont = imTakt === 0;
  if (modus === "takt" || achtel < 0) return imTakt % 2 === 0 ? { art: "klick", betont } : null;
  const art = SCHLAGKLANG[muster.schlaege[imTakt]];
  return art ? { art, betont } : null;
}
