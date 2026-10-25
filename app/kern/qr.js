/* QR-Code nach ISO/IEC 18004 – nur was die App braucht: Byte-Modus, Fehlerkorrektur M, Version 1 bis 10
   (bis 213 Byte, reicht fuer jeden Runden-Link). Ohne Fremdpaket; Aufbau wie Nayukis
   "QR Code generator" (MIT): Datenbits -> Reed-Solomon je Block -> Verschraenken -> Muster -> Maske.
   Ergebnis: Matrix aus true (dunkel) / false (hell), ohne Ruhezone. */

const FEHLERKORREKTUR_M = { formatBits: 0, ecJeBlock: [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], bloecke: [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5] };
const HOECHSTE_VERSION = 10;

export function qrMatrix(text) {
  const daten = new TextEncoder().encode(text);
  const version = passendeVersion(daten.length);
  const code = qrAufbauen(version);
  const codewoerter = mitFehlerkorrektur(datenwoerter(daten, version), version);
  code.codewoerterSetzen(codewoerter);
  code.besteMaskeAnwenden();
  return code.module;
}

/* ---------- Daten ---------- */
function rohModule(version) {
  let anzahl = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const ausrichtung = Math.floor(version / 7) + 2;
    anzahl -= (25 * ausrichtung - 10) * ausrichtung - 55;
    if (version >= 7) anzahl -= 36;
  }
  return anzahl;
}
const datenKapazitaet = (version) =>
  Math.floor(rohModule(version) / 8) - FEHLERKORREKTUR_M.ecJeBlock[version] * FEHLERKORREKTUR_M.bloecke[version];
const zaehlerBits = (version) => (version <= 9 ? 8 : 16);

function passendeVersion(laenge) {
  for (let version = 1; version <= HOECHSTE_VERSION; version++) {
    if (4 + zaehlerBits(version) + 8 * laenge <= datenKapazitaet(version) * 8) return version;
  }
  throw new Error(`Text zu lang fuer einen QR-Code bis Version ${HOECHSTE_VERSION}`);
}

function datenwoerter(daten, version) {
  const bits = [];
  const anhaengen = (wert, laenge) => { for (let i = laenge - 1; i >= 0; i--) bits.push((wert >>> i) & 1); };
  anhaengen(0b0100, 4);
  anhaengen(daten.length, zaehlerBits(version));
  for (const byte of daten) anhaengen(byte, 8);
  const kapazitaet = datenKapazitaet(version) * 8;
  anhaengen(0, Math.min(4, kapazitaet - bits.length));
  anhaengen(0, (8 - (bits.length % 8)) % 8);
  for (let fuell = 0xec; bits.length < kapazitaet; fuell ^= 0xec ^ 0x11) anhaengen(fuell, 8);
  const woerter = [];
  for (let i = 0; i < bits.length; i += 8) woerter.push(bits.slice(i, i + 8).reduce((wort, bit) => (wort << 1) | bit, 0));
  return woerter;
}

/* ---------- Reed-Solomon ueber GF(256), Polynom 0x11D ---------- */
function gfMal(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}
function rsTeiler(grad) {
  const teiler = new Array(grad).fill(0);
  teiler[grad - 1] = 1;
  let wurzel = 1;
  for (let i = 0; i < grad; i++) {
    for (let j = 0; j < teiler.length; j++) {
      teiler[j] = gfMal(teiler[j], wurzel);
      if (j + 1 < teiler.length) teiler[j] ^= teiler[j + 1];
    }
    wurzel = gfMal(wurzel, 0x02);
  }
  return teiler;
}
function rsRest(daten, teiler) {
  const rest = new Array(teiler.length).fill(0);
  for (const byte of daten) {
    const faktor = byte ^ rest.shift();
    rest.push(0);
    teiler.forEach((koeffizient, i) => { rest[i] ^= gfMal(koeffizient, faktor); });
  }
  return rest;
}

function mitFehlerkorrektur(daten, version) {
  const anzahlBloecke = FEHLERKORREKTUR_M.bloecke[version], ecLaenge = FEHLERKORREKTUR_M.ecJeBlock[version];
  const roh = Math.floor(rohModule(version) / 8);
  const kurzeBloecke = anzahlBloecke - (roh % anzahlBloecke), kurzeLaenge = Math.floor(roh / anzahlBloecke);
  const teiler = rsTeiler(ecLaenge), bloecke = [];
  for (let i = 0, k = 0; i < anzahlBloecke; i++) {
    const block = daten.slice(k, k + kurzeLaenge - ecLaenge + (i < kurzeBloecke ? 0 : 1));
    k += block.length;
    const ec = rsRest(block, teiler);
    if (i < kurzeBloecke) block.push(0);
    bloecke.push(block.concat(ec));
  }
  const ergebnis = [];
  for (let i = 0; i < bloecke[0].length; i++) {
    bloecke.forEach((block, j) => { if (i !== kurzeLaenge - ecLaenge || j >= kurzeBloecke) ergebnis.push(block[i]); });
  }
  return ergebnis;
}

/* ---------- Matrix: Muster, Datenbits, Maske ---------- */
const MASKEN = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];
const bit = (wert, stelle) => ((wert >>> stelle) & 1) !== 0;

function qrAufbauen(version) {
  const groesse = version * 4 + 17;
  const module = Array.from({ length: groesse }, () => new Array(groesse).fill(false));
  const fest = Array.from({ length: groesse }, () => new Array(groesse).fill(false));
  const setzen = (x, y, dunkel) => { module[y][x] = dunkel; fest[y][x] = true; };

  function suchmuster(x, y) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const abstand = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < groesse && yy >= 0 && yy < groesse) setzen(xx, yy, abstand !== 2 && abstand !== 4);
      }
    }
  }
  function ausrichtungsmuster(x, y) {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setzen(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  function ausrichtungsstellen() {
    if (version === 1) return [];
    const anzahl = Math.floor(version / 7) + 2;
    const schritt = Math.ceil((version * 4 + 4) / (anzahl * 2 - 2)) * 2;
    const stellen = [6];
    for (let stelle = groesse - 7; stellen.length < anzahl; stelle -= schritt) stellen.splice(1, 0, stelle);
    return stellen;
  }
  function formatbits(maske) {
    const daten = (FEHLERKORREKTUR_M.formatBits << 3) | maske;
    let rest = daten;
    for (let i = 0; i < 10; i++) rest = (rest << 1) ^ ((rest >>> 9) * 0x537);
    const bits = ((daten << 10) | rest) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setzen(8, i, bit(bits, i));
    setzen(8, 7, bit(bits, 6));
    setzen(8, 8, bit(bits, 7));
    setzen(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) setzen(14 - i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) setzen(groesse - 1 - i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) setzen(8, groesse - 15 + i, bit(bits, i));
    setzen(8, groesse - 8, true);
  }
  function versionsbits() {
    if (version < 7) return;
    let rest = version;
    for (let i = 0; i < 12; i++) rest = (rest << 1) ^ ((rest >>> 11) * 0x1f25);
    const bits = (version << 12) | rest;
    for (let i = 0; i < 18; i++) {
      const a = groesse - 11 + (i % 3), b = Math.floor(i / 3);
      setzen(a, b, bit(bits, i));
      setzen(b, a, bit(bits, i));
    }
  }
  function maskeAnwenden(maske) {
    for (let y = 0; y < groesse; y++) for (let x = 0; x < groesse; x++) if (!fest[y][x] && MASKEN[maske](x, y)) module[y][x] = !module[y][x];
  }
  /* Strafpunkte nach den vier Regeln der Norm: lange Laeufe, 2x2-Bloecke, Doppelgaenger des Suchmusters, Dunkelanteil.
     Jede Maske ergibt einen gueltigen Code, die Wertung waehlt nur den am leichtesten lesbaren. Ausserhalb der Matrix
     liegt die helle Ruhezone. */
  function strafpunkte() {
    let punkte = 0, dunkle = 0;
    for (let a = 0; a < groesse; a++) {
      for (const lesen of [(i) => module[a][i], (i) => module[i][a]]) {
        const linie = Array.from({ length: groesse }, (_, i) => (lesen(i) ? "1" : "0")).join("");
        for (const lauf of linie.match(/0{5,}|1{5,}/g) ?? []) punkte += lauf.length - 2;
        punkte += (`0000${linie}0000`.match(/(?=10111010000|00001011101)/g) ?? []).length * 40;
      }
    }
    for (let y = 0; y < groesse; y++) {
      for (let x = 0; x < groesse; x++) {
        if (module[y][x]) dunkle++;
        if (x < groesse - 1 && y < groesse - 1 && module[y][x] === module[y][x + 1] && module[y][x] === module[y + 1][x] && module[y][x] === module[y + 1][x + 1]) punkte += 3;
      }
    }
    const anteil = Math.abs(dunkle * 20 - groesse * groesse * 10);
    return punkte + Math.ceil(anteil / (groesse * groesse)) * 10;
  }

  for (let i = 0; i < groesse; i++) { setzen(6, i, i % 2 === 0); setzen(i, 6, i % 2 === 0); }
  suchmuster(3, 3);
  suchmuster(groesse - 4, 3);
  suchmuster(3, groesse - 4);
  const stellen = ausrichtungsstellen(), letzte = stellen.length - 1;
  stellen.forEach((y, i) => stellen.forEach((x, j) => {
    if (!((i === 0 && j === 0) || (i === 0 && j === letzte) || (i === letzte && j === 0))) ausrichtungsmuster(x, y);
  }));
  formatbits(0);
  versionsbits();

  return {
    module,
    codewoerterSetzen(woerter) {
      let i = 0;
      for (let rechts = groesse - 1; rechts >= 1; rechts -= 2) {
        if (rechts === 6) rechts = 5;
        for (let senkrecht = 0; senkrecht < groesse; senkrecht++) {
          for (let j = 0; j < 2; j++) {
            const x = rechts - j, aufwaerts = ((rechts + 1) & 2) === 0, y = aufwaerts ? groesse - 1 - senkrecht : senkrecht;
            if (!fest[y][x] && i < woerter.length * 8) { module[y][x] = bit(woerter[i >>> 3], 7 - (i & 7)); i++; }
          }
        }
      }
    },
    besteMaskeAnwenden() {
      let beste = 0, wenigste = Infinity;
      for (let maske = 0; maske < 8; maske++) {
        maskeAnwenden(maske);
        formatbits(maske);
        const punkte = strafpunkte();
        if (punkte < wenigste) { wenigste = punkte; beste = maske; }
        maskeAnwenden(maske);
      }
      maskeAnwenden(beste);
      formatbits(beste);
    },
  };
}
