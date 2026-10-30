/* Textspur: der Text eines geschuetzten Liedes, getrennt von der oeffentlichen Liedspur.
   Sie liegt nur privat auf Jarvis und wird beim Laden ueber die Akkorde gelegt.
   Hier: Silben trennen, eingefuegten Text auf Zeilen und Takte legen, Textspur anwenden. */
import { viertelProTakt } from "./liedspur.js";

export const FORMAT_TEXTSPUR = "textspur/1";
const AUFTAKT_SILBE = 0.5; /* shortcut: Auftaktsilben als Achtel, bis Noten oder UltraStar sie genau setzen */

export function textspurAnwenden(lied, spur) {
  if (!spur) return lied;
  return { ...lied, zeilen: spur.zeilen, silben: spur.silben, silbenZeit: spur.silbenZeit };
}

/* ---------- Silbentrennung ----------
   Einfache deutsche Regeln, gedacht fuers Singen, nicht fuer den Buchsatz:
   ein Konsonant geht zur naechsten Silbe (Ho-se), von mehreren nur der letzte (Was-ser, Kin-der);
   ch, ck, sch, ph, th, qu bleiben zusammen (Zu-cker, Mäd-chen); ei, ai, au, eu, äu, ie und
   Doppelvokale werden nicht getrennt (Feu-er). Woerter mit Bindestrich bleiben, wie sie sind. */
const VOKALGRUPPEN = ["äu", "ei", "ai", "au", "eu", "ie", "aa", "ee", "oo"];
const KONSONANTGRUPPEN = ["sch", "ch", "ck", "ph", "th", "qu"];
const VOKAL = /[aeiouäöüyéèáàâ]/;

function lautgruppen(wort) {
  const klein = wort.toLowerCase(), gruppen = [];
  for (let i = 0; i < wort.length;) {
    const gruppe = [...KONSONANTGRUPPEN, ...VOKALGRUPPEN].find((g) => klein.startsWith(g, i));
    const laenge = gruppe ? gruppe.length : 1;
    gruppen.push({ text: wort.slice(i, i + laenge), vokal: VOKAL.test(klein[i]) });
    i += laenge;
  }
  return gruppen;
}

export function silbenTrennen(wort) {
  const teile = /^([^\p{L}]*)([\p{L}'’]+)([^\p{L}]*)$/u.exec(wort);
  if (!teile || wort.includes("-")) return [wort];
  const [, vorne, kern, hinten] = teile;
  const gruppen = lautgruppen(kern);
  const vokale = gruppen.map((g, i) => (g.vokal ? i : -1)).filter((i) => i >= 0);
  if (vokale.length < 2) return [wort];
  const schnitte = [];
  for (let v = 1; v < vokale.length; v++) {
    const konsonanten = vokale[v] - vokale[v - 1] - 1;
    schnitte.push(konsonanten === 0 ? vokale[v] : vokale[v] - 1);
  }
  const silben = [];
  let von = 0;
  for (const schnitt of [...schnitte, gruppen.length]) {
    silben.push(gruppen.slice(von, schnitt).map((g) => g.text).join(""));
    von = schnitt;
  }
  silben[0] = vorne + silben[0];
  silben[silben.length - 1] += hinten;
  return silben.map((silbe, i) => (i < silben.length - 1 ? `${silbe}-` : silbe));
}

/* "Ich hab die Ho-se" -> ["Ich", "hab", "die", "Ho-", "se"] */
export function silbenAusText(text) {
  return text.trim().split(/\s+/).filter(Boolean).flatMap((wort) => {
    if (!wort.includes("-")) return silbenTrennen(wort);
    const stuecke = wort.split("-").filter(Boolean);
    return stuecke.map((stueck, i) => (i < stuecke.length - 1 ? `${stueck}-` : stueck));
  });
}

/* ---------- Eingefuegten Text auf die Liedzeilen legen ----------
   Eine Textzeile je Liedzeile, Leerzeilen zaehlen nicht. Mit "|" laesst sich eine Zeile auf die
   Takte verteilen; ein Abschnitt mehr als Takte ist der Auftakt (wie im alten Taktraster).
   Die Silben werden innerhalb ihres Abschnitts gleichmaessig verteilt: Zeit "geschaetzt". */

/* Was Liedseiten beim Kopieren mitliefern, ist kein Liedtext: Abschnitts-Ueberschriften wie [Refrain],
   Seitenkopf und -fuss von Genius und Musixmatch. So genuegt Kopieren und Einfuegen ohne Nacharbeit. */
const SEITENRESTE = [/^\[.*\]$/, /^\d+\s*Contributors?/i, /\sLyrics$/, /^You might also like$/i, /^Lyrics powered by/i, /^Writer\(s\):/i];

export function liedtextZeilen(text) {
  return text.split(/\r?\n/)
    .map((zeile) => zeile.trim().replace(/\d*Embed$/, "").trim())
    .filter((zeile) => zeile && !SEITENRESTE.some((muster) => muster.test(zeile)));
}

export function textAufZeilen(lied, text) {
  const proTakt = viertelProTakt(lied);
  const textzeilen = liedtextZeilen(text);
  const anfaenge = lied.zeilen.map((start) => Math.ceil(start / proTakt - 1e-9) * proTakt + 0);
  const hinweise = [];
  if (textzeilen.length > anfaenge.length) {
    hinweise.push(`Der Text hat ${textzeilen.length} Zeilen, das Lied nur ${anfaenge.length}. Die letzten ${textzeilen.length - anfaenge.length} bleiben weg.`);
  } else if (textzeilen.length < anfaenge.length) {
    hinweise.push(`Der Text hat ${textzeilen.length} Zeilen, das Lied ${anfaenge.length}. Die übrigen Zeilen bleiben ohne Text.`);
  }

  const zeilen = anfaenge.map((anfang, i) => {
    const ende = anfaenge[i + 1] ?? lied.laenge;
    const takte = Math.max(1, Math.round((ende - anfang) / proTakt));
    const abschnitte = (textzeilen[i] ?? "").includes("|") ? textzeilen[i].split("|") : [textzeilen[i] ?? ""];
    let auftakt = [];
    if (abschnitte.length > takte) {
      const vorne = abschnitte.splice(0, abschnitte.length - takte + 1);
      auftakt = silbenAusText(vorne.slice(0, -1).join(" "));
      abschnitte.unshift(vorne[vorne.length - 1]);
    }
    return { anfang, ende, auftakt, abschnitte: abschnitte.map(silbenAusText) };
  });

  const silben = [], zeilenAnfaenge = [];
  zeilen.forEach((zeile, i) => {
    const auftaktBeginn = zeile.anfang - zeile.auftakt.length * AUFTAKT_SILBE;
    zeilenAnfaenge.push(zeile.auftakt.length ? auftaktBeginn : zeile.anfang);
    zeile.auftakt.forEach((silbe, k) => silben.push({ ab: runden(auftaktBeginn + k * AUFTAKT_SILBE), lang: AUFTAKT_SILBE, text: silbe }));
    /* Am Zeilenende Platz lassen fuer den Auftakt der naechsten Zeile */
    const naechsterAuftakt = (zeilen[i + 1]?.auftakt.length ?? 0) * AUFTAKT_SILBE;
    const bereiche = zeile.abschnitte.length === 1
      ? [{ von: zeile.anfang, bis: zeile.ende - naechsterAuftakt, silben: zeile.abschnitte[0] }]
      : zeile.abschnitte.map((abschnitt, t) => ({
        von: zeile.anfang + t * proTakt,
        bis: zeile.anfang + (t + 1) * proTakt - (t === zeile.abschnitte.length - 1 ? naechsterAuftakt : 0),
        silben: abschnitt,
      }));
    for (const bereich of bereiche) {
      const schritt = (bereich.bis - bereich.von) / Math.max(bereich.silben.length, 1);
      const starts = bereich.silben.map((_, k) => runden(bereich.von + k * schritt)).concat(runden(bereich.bis));
      bereich.silben.forEach((silbe, k) => silben.push({ ab: starts[k], lang: runden(starts[k + 1] - starts[k]), text: silbe }));
    }
  });
  const spur = { format: FORMAT_TEXTSPUR, lied: lied.id, zeilen: zeilenAnfaenge, silben, silbenZeit: "geschaetzt" };
  return { spur, hinweise };
}

/* Fuer das Bearbeiten: eine Textspur zurueck in Textzeilen mit Bindestrichen */
export function textAusSpur(lied, spur) {
  const angewendet = textspurAnwenden(lied, spur);
  return angewendet.zeilen.map((start, i) => {
    const ende = angewendet.zeilen[i + 1] ?? angewendet.laenge;
    return angewendet.silben.filter((silbe) => silbe.ab >= start && silbe.ab < ende)
      .map((silbe) => silbe.text).join(" ").replace(/- /g, "-");
  }).join("\n");
}

const runden = (wert) => Math.round(wert * 1000) / 1000 + 0;
