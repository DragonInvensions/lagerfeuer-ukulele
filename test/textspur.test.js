import { test } from "node:test";
import assert from "node:assert/strict";
import { silbenTrennen, silbenAusText, textAufZeilen, textAusSpur, textspurAnwenden, liedtextZeilen, textAnNoten } from "../app/kern/textspur.js";
import { pruefen, FORMAT } from "../app/kern/liedspur.js";

test("Silbentrennung nach einfachen deutschen Regeln", () => {
  const faelle = {
    Hose: "Ho-se", Wasser: "Was-ser", Kinder: "Kin-der", zerrissen: "zer-ris-sen", Zucker: "Zu-cker",
    Mädchen: "Mäd-chen", Feuer: "Feu-er", Lagerfeuer: "La-ger-feu-er", Strophe: "Stro-phe",
    Schwammkopf: "Schwamm-kopf", Allerbeste: "Al-ler-bes-te", Glück: "Glück", "See,": "See,",
    "»Wünsch": "»Wünsch", "Ananas!": "A-na-nas!", "Hey,": "Hey,", Okay: "O-kay", Boy: "Boy", Bayern: "Bay-ern",
  };
  for (const [wort, erwartet] of Object.entries(faelle)) {
    assert.deepEqual(silbenTrennen(wort), erwartet.split("-").map((s, i, alle) => (i < alle.length - 1 ? `${s}-` : s)), wort);
  }
});

test("Bindestriche des Nutzers gehen vor", () => {
  assert.deepEqual(silbenAusText("Sponge-Bob Schwamm-kopf"), ["Sponge-", "Bob", "Schwamm-", "kopf"]);
  assert.deepEqual(silbenAusText("Ich hab die Hose"), ["Ich", "hab", "die", "Ho-", "se"]);
});

function geschuetztesLied() {
  return {
    format: FORMAT, id: "probe", titel: "Probe", gemeinfrei: false, takt: [4, 4], tempo: [{ ab: 0, bpm: 100 }],
    zeilen: [0, 8], laenge: 16, silbenZeit: "geschaetzt", silben: [],
    akkorde: [{ ab: 0, akk: "C" }, { ab: 8, akk: "G7" }],
  };
}

test("Text auf Zeilen legen: gleichmaessig je Zeile, gueltige Liedspur", () => {
  const lied = geschuetztesLied();
  const { spur, hinweise } = textAufZeilen(lied, "Ich hab die Hose\n\nmir zerrissen");
  assert.deepEqual(hinweise, []);
  assert.deepEqual(spur.silben.map((s) => s.text), ["Ich", "hab", "die", "Ho-", "se", "mir", "zer-", "ris-", "sen"]);
  assert.equal(spur.silben[0].ab, 0);
  assert.equal(spur.silben[5].ab, 8);
  assert.deepEqual(pruefen(textspurAnwenden(lied, spur)), []);
});

test("Mit | auf Takte verteilen, ein Abschnitt mehr ist Auftakt", () => {
  const lied = geschuetztesLied();
  const { spur } = textAufZeilen(lied, "Ich hab | die Hose\nund | mir zer- | rissen");
  const zweite = spur.silben.filter((s) => s.ab >= spur.zeilen[1]);
  assert.equal(zweite[0].text, "und");
  assert.equal(zweite[0].ab, 7.5, "Auftakt liegt ein Achtel vor dem Taktstrich");
  assert.equal(spur.zeilen[1], 7.5);
  assert.equal(zweite[1].ab, 8);
  assert.deepEqual(pruefen(textspurAnwenden(lied, spur)), []);
});

test("Zu wenige oder zu viele Zeilen werden gemeldet", () => {
  assert.match(textAufZeilen(geschuetztesLied(), "nur eine Zeile").hinweise[0], /übrigen Zeilen bleiben ohne Text/);
  assert.match(textAufZeilen(geschuetztesLied(), "a\nb\nc").hinweise[0], /letzten 1 bleiben weg/);
});

test("Textspur zurueck in Text fuers Bearbeiten", () => {
  const lied = geschuetztesLied();
  const { spur } = textAufZeilen(lied, "Ich hab die Hose\nmir zerrissen");
  assert.equal(textAusSpur(lied, spur), "Ich hab die Ho-se\nmir zer-ris-sen");
});

test("Von Liedseiten eingefuegter Text wird gesaeubert: Ueberschriften und Seitenreste fallen weg", () => {
  const eingefuegt = [
    "12 ContributorsTranslationsDeutsch",
    "Probe Lyrics",
    "[Strophe 1]",
    "Erste Zeile hier",
    "",
    "[Refrain: Alle]",
    "  Zweite Zeile da  ",
    "You might also like",
    "Dritte Zeile dort3Embed",
    "Lyrics powered by www.musixmatch.com",
    "Writer(s): Jemand",
  ].join("\r\n");
  assert.deepEqual(liedtextZeilen(eingefuegt), ["Erste Zeile hier", "Zweite Zeile da", "Dritte Zeile dort"]);
  const { spur } = textAufZeilen(geschuetztesLied(), eingefuegt);
  assert.equal(spur.silben[0].text, "Ers-");
});

/* ---------- An die Noten anpassen (erfundene Texte) ---------- */
const liedMitTeilen = (abschnitte, zeilen, laenge) => ({ ...geschuetztesLied(), abschnitte, zeilen, laenge });
const angepasst = (lied, text) => textAnNoten(lied, text).text.split("\n");

test("Anpassen: Strophe und Refrain kommen aus den passend ueberschriebenen Teilen", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Strophe" }, { ab: 16, name: "Refrain" }], [0, 8, 16, 24], 32);
  const text = "[Strophe 1]\neins zwei drei\nvier fünf sechs\n\n[Refrain]\nla la la\nli li li\n\n[Strophe 2]\nsieben acht\nneun zehn\n\n[Refrain]\nla la la\nli li li";
  assert.deepEqual(angepasst(lied, text), ["eins zwei drei", "vier fünf sechs", "la la la", "li li li"]);
});

test("Anpassen: englische Ueberschriften, ein Vorrefrain zaehlt nicht als Refrain", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Strophe" }, { ab: 16, name: "Refrain" }], [0, 8, 16, 24], 32);
  assert.deepEqual(angepasst(lied, "[Verse 1]\nx\ny\n[Pre-Chorus]\np\n[Chorus: Alle]\nc\nd"), ["x", "y", "c", "d"]);
});

test("Anpassen: vier Textzeilen auf zwei gleich lange Liedzeilen werden paarweise verbunden", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Strophe" }], [0, 8], 16);
  assert.deepEqual(angepasst(lied, "[Strophe]\nich bin hier\ndu bist da\nwir sind dort\nihr seid weg"),
    ["ich bin hier du bist da", "wir sind dort ihr seid weg"]);
});

test("Anpassen: ungleich lange Liedzeilen bekommen anteilig Silben", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Strophe" }], [0, 4], 16);
  assert.deepEqual(angepasst(lied, "[Strophe]\na b c d e f g h"), ["a b", "c d e f g h"]);
});

test("Anpassen: ohne Ueberschriften trennen Leerzeilen die Teile", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Strophe" }, { ab: 16, name: "Refrain" }], [0, 8, 16, 24], 32);
  assert.deepEqual(angepasst(lied, "a\nb\n\nc\nd"), ["a", "b", "c", "d"]);
  assert.deepEqual(angepasst(lied, "x\ny"), ["x", "y"], "ein einziger Teil bleibt, wie er ist");
});

test("Anpassen: ein Vorspiel ohne Text bleibt als '-' frei und wird so gespeichert", () => {
  const lied = liedMitTeilen([{ ab: 0, name: "Vorspiel" }, { ab: 8, name: "Strophe" }], [0, 8, 16], 24);
  const { text, hinweise } = textAnNoten(lied, "[Strophe 1]\neins\nzwei");
  assert.equal(text, "-\neins\nzwei");
  assert.match(hinweise.join(" "), /Vorspiel/);
  const { spur } = textAufZeilen(lied, text);
  assert.deepEqual(spur.silben.map((s) => [s.ab, s.text]), [[8, "eins"], [16, "zwei"]]);
  assert.equal(textAusSpur(lied, spur), "-\neins\nzwei", "die freie Zeile bleibt beim Bearbeiten erhalten");
});

test("Anpassen: zwei Haelften eines Refrains und ein durchgehender Teil", () => {
  const haelften = liedMitTeilen([{ ab: 0, name: "Refrain — erste Hälfte" }, { ab: 8, name: "Refrain — zweite Hälfte" }], [0, 8], 16);
  assert.deepEqual(angepasst(haelften, "[Strophe]\nnein\nnein\n[Refrain]\nla la\nli li"), ["la la", "li li"]);
  const durchgehend = liedMitTeilen([{ ab: 0, name: "Durchgehend (Strophe wie Refrain)" }], [0, 8], 16);
  assert.deepEqual(angepasst(durchgehend, "[Verse 1]\na\nb\n[Chorus]\nc\nd"), ["a", "b"]);
});
