/* Griffbild als SVG (Zeichenweise aus der alten App, quelle/p5-core.js: chordSVG).
   Saiten G C E A von links, Sattel oben; Farben kommen aus dem CSS (currentColor, --punkt). */
import { griff } from "../kern/griffe.js";

export function griffbildSVG(name, groesse = 1) {
  const g = griff(name);
  const breite = 62 * groesse, hoehe = 74 * groesse, rand = 9 * groesse, oben = 15 * groesse;
  const spalte = (breite - 2 * rand) / 3, zeile = (hoehe - oben - 7 * groesse) / 4;
  if (!g) {
    return `<svg width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}" role="img" aria-label="${name}: kein Griffbild vorhanden"></svg>`;
  }
  const gegriffen = g.bund.filter((bund) => bund > 0);
  const basis = Math.max(...g.bund) > 4 ? Math.min(...gegriffen) : 1;
  const teile = [];
  if (basis === 1) {
    teile.push(`<rect x="${rand}" y="${oben - 3 * groesse}" width="${spalte * 3}" height="${3 * groesse}" fill="currentColor"/>`);
  } else {
    teile.push(`<text x="${rand + spalte * 3 + 3 * groesse}" y="${oben + zeile * 0.7}" font-size="${8 * groesse}" fill="currentColor" opacity=".7">${basis}</text>`);
  }
  for (let i = 0; i <= 4; i++) {
    teile.push(`<line x1="${rand}" y1="${oben + i * zeile}" x2="${rand + spalte * 3}" y2="${oben + i * zeile}" stroke="currentColor" stroke-width="${groesse}" opacity=".4"/>`);
  }
  for (let saite = 0; saite < 4; saite++) {
    teile.push(`<line x1="${rand + saite * spalte}" y1="${oben}" x2="${rand + saite * spalte}" y2="${oben + 4 * zeile}" stroke="currentColor" stroke-width="${groesse}" opacity=".6"/>`);
    if (g.bund[saite] === 0) {
      teile.push(`<circle cx="${rand + saite * spalte}" cy="${oben - 7.5 * groesse}" r="${2.6 * groesse}" fill="none" stroke="currentColor" stroke-width="${groesse}" opacity=".7"/>`);
    }
  }
  if (g.barre && g.barre[0] >= basis && g.barre[0] < basis + 4) {
    const y = oben + (g.barre[0] - basis + 0.5) * zeile;
    teile.push(`<rect x="${rand + g.barre[1] * spalte - 4 * groesse}" y="${y - 4 * groesse}" width="${(g.barre[2] - g.barre[1]) * spalte + 8 * groesse}" height="${8 * groesse}" rx="${4 * groesse}" fill="var(--punkt)"/>`);
  }
  g.bund.forEach((bund, saite) => {
    if (bund <= 0 || bund < basis || bund >= basis + 4) return;
    const imBarre = g.barre && bund === g.barre[0] && saite >= g.barre[1] && saite <= g.barre[2];
    if (imBarre) return;
    const x = rand + saite * spalte, y = oben + (bund - basis + 0.5) * zeile;
    teile.push(`<circle cx="${x}" cy="${y}" r="${4.6 * groesse}" fill="var(--punkt)"/>`);
    if (g.finger[saite] > 0) {
      teile.push(`<text x="${x}" y="${y + 2.4 * groesse}" text-anchor="middle" font-size="${6.4 * groesse}" font-weight="800" fill="var(--punkt-schrift)">${g.finger[saite]}</text>`);
    }
  });
  return `<svg width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}" role="img" aria-label="Griffbild ${name}">${teile.join("")}</svg>`;
}
