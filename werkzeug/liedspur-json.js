/* Schreibt eine Liedspur so, dass sie sich von Hand lesen und im Diff pruefen laesst:
   Kopfangaben je eine Zeile, in den Listen ein Eintrag je Zeile. */
const LISTEN = new Set(["tempo", "abschnitte", "akkorde", "silben", "quellen"]);

export function alsJson(lied) {
  const zeilen = Object.entries(lied).map(([schluessel, wert]) => {
    if (LISTEN.has(schluessel) && Array.isArray(wert) && wert.length) {
      return `  ${JSON.stringify(schluessel)}: [\n${wert.map((eintrag) => `    ${JSON.stringify(eintrag)}`).join(",\n")}\n  ]`;
    }
    return `  ${JSON.stringify(schluessel)}: ${JSON.stringify(wert)}`;
  });
  return `{\n${zeilen.join(",\n")}\n}\n`;
}
