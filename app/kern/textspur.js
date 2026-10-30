/* Textspur: der Text eines geschuetzten Liedes, getrennt von der oeffentlichen Liedspur.
   Sie liegt nur privat auf Jarvis und wird beim Laden ueber die Akkorde gelegt.
   Hier: Silben trennen, eingefuegten Text auf Zeilen und Takte legen, Textspur anwenden. */
import { viertelProTakt, zeilenEnde, abschnittDerZeilen } from "./liedspur.js";

export const FORMAT_TEXTSPUR = "textspur/1";
const AUFTAKT_SILBE = 0.5; /* shortcut: Auftaktsilben als Achtel, bis Noten oder UltraStar sie genau setzen */

export function textspurAnwenden(lied, spur) {
  if (!spur) return lied;
  return { ...lied, zeilen: spur.zeilen, silben: spur.silben, silbenZeit: spur.silbenZeit };
}

/* ---------- Silbentrennung ----------
   Einfache deutsche Regeln, gedacht fuers Singen, nicht fuer den Buchsatz:
   ein Konsonant geht zur naechsten Silbe (Ho-se), von mehreren nur der letzte (Was-ser, Kin-der);
   ch, ck, sch, ph, th, qu bleiben zusammen (Zu-cker, Mäd-chen); ei, ai, au, eu, äu, ie, ey, ay, oy und
   Doppelvokale werden nicht getrennt (Feu-er, Hey, Bay-ern). Woerter mit Bindestrich bleiben, wie sie sind. */
const VOKALGRUPPEN = ["äu", "ei", "ai", "au", "eu", "ie", "ey", "ay", "oy", "aa", "ee", "oo"];
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
   Eine Textzeile je Liedzeile, Leerzeilen zaehlen nicht; eine Zeile nur mit "-" bleibt ohne Text
   (etwa ein Vorspiel). Mit "|" laesst sich eine Zeile auf die
   Takte verteilen; ein Abschnitt mehr als Takte ist der Auftakt (wie im alten Taktraster).
   Die Silben werden innerhalb ihres Abschnitts gleichmaessig verteilt: Zeit "geschaetzt". */

/* Was Liedseiten beim Kopieren mitliefern, ist kein Liedtext: Abschnitts-Ueberschriften wie [Refrain],
   Seitenkopf und -fuss von Genius und Musixmatch. So genuegt Kopieren und Einfuegen ohne Nacharbeit. */
const SEITENRESTE = [/^\[.*\]$/, /^\d+\s*Contributors?/i, /\sLyrics$/, /^You might also like$/i, /^Lyrics powered by/i, /^Writer\(s\):/i];
export const OHNE_TEXT = "-";

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
    const zeilentext = textzeilen[i] === OHNE_TEXT ? "" : textzeilen[i] ?? "";
    const abschnitte = zeilentext.includes("|") ? zeilentext.split("|") : [zeilentext];
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

/* ---------- Einen ganzen Liedtext an die Noten anpassen ----------
   1. Den Text in Teile zerlegen: an Ueberschriften wie [Refrain] oder, wenn es keine gibt, an Leerzeilen.
   2. Jedem Teil der Noten (Strophe, Refrain, …) das passende Textstueck zuordnen.
   3. Die Woerter nach Silben so auf die Liedzeilen verteilen, wie die Zeilen lang sind, bevorzugt
      an den Zeilenenden und Satzzeichen des Originals. Das Ergebnis prueft Jakob in der Vorschau. */
const TEILARTEN = [
  [null, /durchgehend/i], ["vorrefrain", /pre-?chorus|vor-?refrain/i], ["nachrefrain", /post-?chorus/i],
  ["refrain", /refrain|chorus|hook|kehrreim/i], ["strophe", /strophe|vers/i], ["bridge", /bridge|zwischenteil/i],
  ["vorspiel", /intro|vorspiel/i], ["schluss", /outro|schluss|ende\b/i],
];
const teilArt = (name) => (TEILARTEN.find(([, muster]) => muster.test(name ?? "")) ?? [null])[0];
const ZEILENENDE_BONUS = 3, SATZZEICHEN_BONUS = 1.5; /* in Silben: so weit darf ein Umbruch vom Soll abweichen, um dort zu liegen */

export function textAnNoten(lied, text) {
  const teile = textTeile(text), gruppen = notenGruppen(lied), hinweise = [];
  const mitUeberschriften = teile.some((teil) => teil.mitUeberschrift);
  if (!mitUeberschriften && teile.length <= 1) return { text: (teile[0]?.zeilen ?? []).join("\n"), hinweise };

  const benutzt = new Set();
  let zuletzt = -1;
  const zeilen = gruppen.flatMap((gruppe) => {
    const index = passenderTeil(teile, gruppe, benutzt, zuletzt, mitUeberschriften);
    if (index < 0) {
      hinweise.push(`Für „${gruppe.name}“ fand sich im Text kein passender Teil; die Zeilen bleiben frei (${OHNE_TEXT}).`);
      return gruppe.laengen.map(() => OHNE_TEXT);
    }
    benutzt.add(index);
    zuletzt = Math.max(zuletzt, index);
    return aufZeilenVerteilen(teile[index].zeilen, gruppe.laengen).map((zeile) => zeile || OHNE_TEXT);
  });
  return { text: zeilen.join("\n"), hinweise };
}

/* Mit Ueberschriften trennen nur diese die Teile (Liedseiten setzen Leerzeilen auch mitten hinein) */
function textTeile(text) {
  const mitUeberschriften = /^\s*\[.*\]\s*$/m.test(text);
  const teile = [];
  let ueberschrift = null, offen = null;
  for (const roh of text.split(/\r?\n/)) {
    const kopf = /^\s*\[(.*)\]\s*$/.exec(roh);
    if (kopf) {
      ueberschrift = kopf[1];
      offen = null;
      continue;
    }
    const [zeile] = liedtextZeilen(roh);
    if (!zeile) {
      if (!mitUeberschriften) offen = null;
      continue;
    }
    if (!offen) {
      offen = { art: teilArt(ueberschrift), mitUeberschrift: ueberschrift !== null, zeilen: [] };
      teile.push(offen);
    }
    offen.zeilen.push(zeile);
  }
  return teile;
}

/* Liedzeilen nach ihrem Abschnitt gruppiert; aufeinanderfolgende Refrain-Abschnitte sind Haelften desselben Refrains,
   aufeinanderfolgende Strophen dagegen verschiedene Strophen */
function notenGruppen(lied) {
  const gruppen = [];
  abschnittDerZeilen(lied).forEach((abschnitt, i) => {
    const art = teilArt(abschnitt?.name), letzte = gruppen.at(-1), laenge = zeilenEnde(lied, i) - lied.zeilen[i];
    if (letzte && (letzte.abschnitt === abschnitt || (art === "refrain" && letzte.art === "refrain"))) letzte.laengen.push(laenge);
    else gruppen.push({ abschnitt, name: abschnitt?.name ?? "Lied", art, laengen: [laenge] });
  });
  return gruppen;
}

function passenderTeil(teile, gruppe, benutzt, zuletzt, mitUeberschriften) {
  const frei = (index) => !benutzt.has(index);
  if (mitUeberschriften && gruppe.art) {
    const gleicheArt = teile.map((_, index) => index).filter((index) => teile[index].art === gruppe.art);
    /* Ein Refrain wiederholt sich: Ist keiner mehr frei, gilt derselbe noch einmal */
    return gleicheArt.find(frei) ?? (gruppe.art === "refrain" && gleicheArt.length ? gleicheArt[0] : -1);
  }
  return teile.findIndex((_, index) => index > zuletzt && frei(index));
}

function aufZeilenVerteilen(zeilen, laengen) {
  if (zeilen.length === laengen.length) return zeilen;
  const woerter = zeilen.flatMap((zeile) => zeile.split(/\s+/).map((wort, i, alle) => ({
    wort, silben: silbenAusText(wort).length || 1, zeilenende: i === alle.length - 1,
  })));
  const alleSilben = woerter.reduce((summe, wort) => summe + wort.silben, 0);
  const alleLaenge = laengen.reduce((summe, laenge) => summe + laenge, 0);
  const ergebnis = [];
  let start = 0, bisherSilben = 0, bisherLaenge = 0;
  for (let k = 0; k < laengen.length - 1; k++) {
    bisherLaenge += laengen[k];
    const soll = (alleSilben * bisherLaenge) / alleLaenge, nochZeilen = laengen.length - 1 - k;
    let beste = null, summe = bisherSilben;
    for (let ende = start; ende < woerter.length - nochZeilen; ende++) {
      summe += woerter[ende].silben;
      const bonus = woerter[ende].zeilenende ? ZEILENENDE_BONUS : /[,;:.!?]$/.test(woerter[ende].wort) ? SATZZEICHEN_BONUS : 0;
      const kosten = Math.abs(summe - soll) - bonus;
      if (!beste || kosten < beste.kosten) beste = { ende, kosten, summe };
    }
    if (!beste) {
      ergebnis.push("");
      continue;
    }
    ergebnis.push(woerter.slice(start, beste.ende + 1).map((eintrag) => eintrag.wort).join(" "));
    start = beste.ende + 1;
    bisherSilben = beste.summe;
  }
  ergebnis.push(woerter.slice(start).map((eintrag) => eintrag.wort).join(" "));
  return ergebnis;
}

/* Fuer das Bearbeiten: eine Textspur zurueck in Textzeilen mit Bindestrichen; Zeilen ohne Text als "-" */
export function textAusSpur(lied, spur) {
  const angewendet = textspurAnwenden(lied, spur);
  return angewendet.zeilen.map((start, i) => {
    const ende = angewendet.zeilen[i + 1] ?? angewendet.laenge;
    return angewendet.silben.filter((silbe) => silbe.ab >= start && silbe.ab < ende)
      .map((silbe) => silbe.text).join(" ").replace(/- /g, "-") || OHNE_TEXT;
  }).join("\n");
}

const runden = (wert) => Math.round(wert * 1000) / 1000 + 0;
