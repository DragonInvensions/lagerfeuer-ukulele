# Konzept: Mitspielen wie SingStar + Guitar Hero

Stand 24.10.2026. Grundlage für den Neuaufbau des Liederteils der Lagerfeuer-Ukulele.
Vorbild der Ansicht zum Anklicken: [`vorbild-mitspielen.html`](vorbild-mitspielen.html).

**Ziel:** Du siehst bei jedem Lied gleichzeitig, **welche Silbe wann** gesungen wird und **welcher Akkord wann und wie lange**
gespielt wird, damit du am Lagerfeuer mitsingen und spielen kannst. Das soll in deinem eigenen Tempo gehen und, wenn du willst,
synchron zur Originalaufnahme.

---

## 1. Was heute fehlt (gemessen, nicht geschätzt)

Ich habe probehalber alle Lieder aus `quelle/p6-songs-a.js` und `p7-songs-b.js` ins neue Format umgesetzt (heute [`werkzeug/uebernahme.js`](../werkzeug/uebernahme.js)):

| Befund | Zahl |
|---|---|
| Lieder | 42 (das README nennt noch 26) |
| Takte / Akkordwechsel | 1 859 / 1 428, **alle verlustfrei übertragbar** |
| Lieder mit Text (gemeinfrei) | 23, zusammen 3 516 Silben |
| Lieder ohne Text (geschützt) | 19: nichts zum Mitsingen da |
| Tempowechsel nur als Freitext | 1 (Lagerfeuerlied: „116 bpm, dann doppelt“) |

**Kern des Problems:** Gespeichert ist nur, *welche* Silben in einem Takt liegen, aber nicht, *wo* im Takt sie sitzen.
`p10-mitspielen.js` verteilt sie deshalb gleichmäßig. Das ergibt Rhythmen, die niemand singt:

- „schwim-men auf dem See“: fünf Silben auf vier Schläge, also je 0,8 Schläge. Das wäre eine Quintole.
- „Muss i denn, muss i denn“: drei Silben im Takt ergeben Triolen von je 1,33 Schlägen.

Die Akkorde stehen dagegen schon taktgenau richtig. Es fehlt nur die Zeit der Silben, und bei geschützten Liedern der Text.

---

## 2. Erst prüfen: Gibt es das fertig zu kaufen?

| App | Was sie kann | Was dir fehlt | Preis |
|---|---|---|---|
| **Chord ai** | jedes Lied (YouTube, Datei, Apple Music, Mikrofon): erkennt Akkorde, zeigt Ukulele-Griffe, „Simple“-Stufe nur Dur/Moll, Tonart verschiebbar, Liedtext-Erkennung auf dem Gerät in ~100 Sprachen | Silbengenaue Anzeige nicht belegt. Akkorde sind automatisch erkannt, also mit Fehlern. Kein Lagerfeuermodus ohne Aufnahme | gratis eingeschränkt, Pro 69,99 $/Jahr |
| **Kala Ukulele** (Musopia) | Karaoke-Anzeige mit Akkorden und Text, Begleitspuren, Tempo regelbar | lizenzierter Katalog: deutsche Synchronfassungen (SpongeBob, Pokémon) unwahrscheinlich, nicht geprüft | Songs 34,99 $/Jahr, alles 79,99 $/Jahr |
| **Chordify** | Akkorde zu jedem YouTube-Video, Ukulele-Griffbilder, lizenzierte Texte (LyricFind) | Silben-Synchronität nicht belegt | um £3/Monat bei Jahreszahlung (Stand des Artikels) |
| **Yousician** | hört zu und bewertet, eigene Ukulele-App | Textanzeige beim Ukulelespiel nicht belegt | ~120 $/Jahr (Quellen uneinig) |

**Fazit:** Für englische Pop-Lieder reicht wahrscheinlich Kala oder Chord ai. Für deutsche Titelsongs, Volkslieder,
deinen Lagerfeuermodus im eigenen Tempo und deine vereinfachten Anfängergriffe gibt es nichts Fertiges. Der Neuaufbau lohnt sich
also genau für diese Lücke, nicht als Ersatz für Kala.
→ **Schritt 0 (15 Minuten, nur du):** Chord ai gratis mit „Pokémon Titelsong deutsch“ und dem „Lagerfeuerlied-Lied“ testen.

---

## 3. Gibt es fertige Daten?

| Quelle | Silben mit Zeit | Akkorde | Bemerkung |
|---|---|---|---|
| **UltraStar-Format** (offener SingStar-Nachbau) | ja: jede Silbe mit Startschlag, Länge und Tonhöhe | nein | offene Spezifikation v1.1.0 (usdx.eu). Große Community-Datenbank **USDB** (Lied-Nummern bis 32 581, Login nötig) |
| **LRCLIB** | nur zeilenweise | nein | frei, aber zu grob für Silben |
| Akkord-Charts (UkuTabs, Ultimate Guitar), **ChordPro** | nein | ja, ohne Zeit | so arbeitet der Skill `ukulele-lehrbuch` heute |

**Es gibt keine fertige Quelle, die beides verbindet.** Das eigentlich Neue an der App ist diese Verbindung: Silben
(aus UltraStar oder selbst getippt) und Akkorde (aus dem Chart) liegen auf **einem gemeinsamen Taktraster**.

---

## 4. Die Kernentscheidung: alles in Takt-Zeit, nie in Sekunden

Jede Position wird in **Vierteln ab der Eins von Takt 1** gespeichert, ein Auftakt ist negativ. Sekunden werden erst beim Abspielen ausgerechnet.

Warum:
- Am Lagerfeuer läuft keine Aufnahme. Du spielst in deinem Tempo, und beim Üben langsamer ändert sich nur die Uhr, nicht die Daten.
- Akkordwechsel fallen musikalisch auf Schläge. Im Raster stimmen sie von selbst, in Sekunden wären sie immer ein bisschen daneben.
- UltraStar rechnet genauso (Schläge plus BPM plus GAP). Deshalb lässt es sich ohne Verlust einlesen.

Eine **Aufnahme** ist davon getrennt eine *Bindung*: eine Liste, in welcher Sekunde jedes Viertel beginnt (Schlagliste).
Dazwischen wird linear umgerechnet. So passt sich die App den Tempo-Schwankungen echter Aufnahmen an, und ein Lied kann an mehrere
Aufnahmen gebunden sein (Original, Cover, eigene Aufnahme).

---

## 5. Datenformat „Liedspur“ (Version 1)

```json
{
  "format": "liedspur/1",
  "id": "entchen", "titel": "Alle meine Entchen", "gemeinfrei": true,
  "tonart": "C", "takt": [4, 4],
  "tempo": [{"ab": 0, "bpm": 100}],
  "schlagmuster": "Der Wandertakt",
  "abschnitte": [{"ab": 0, "name": "1. Strophe"}],
  "zeilen": [0, 8, 16, 24, 32],
  "akkorde": [{"ab": 0, "akk": "C"}, {"ab": 8, "akk": "F"}, {"ab": 12, "akk": "C"}],
  "silben": [
    {"ab": 0, "lang": 1, "text": "Al-"}, {"ab": 1, "lang": 1, "text": "le"},
    {"ab": 4, "lang": 2, "text": "Ent-"}, {"ab": 6, "lang": 2, "text": "chen"}
  ],
  "silbenZeit": "getippt",
  "quellen": [{"t": "Akkorde abgeglichen mit …", "u": "https://…"}]
}
```

| Feld | Bedeutung |
|---|---|
| `ab` | Position in Vierteln. 6/8 hat 3 Viertel je Takt, Achtel sind `0.5`, Sechzehntel `0.25`, Triolen `1/3` |
| `tempo` | Tempokarte. Lagerfeuerlied: `[{"ab":0,"bpm":116},{"ab":64,"bpm":232}]` (Teil B beginnt bei 64) |
| `akkorde` | nur Wechsel. Die Dauer reicht bis zum nächsten Wechsel und wird **abgeleitet, nicht gespeichert** |
| `silben` | `text` endet auf `-`, wenn das Wort weitergeht (wie heute). Optional `stimme`, nur für Ruf und Antwort im SpongeBob-Titelsong |
| `zeilen` | wo eine Textzeile beginnt. Geschützte Lieder ohne Text haben trotzdem Zeilen, damit die Akkord-Zeilen bleiben |
| `silbenZeit` | `geschaetzt` (übernommen) → `getippt` → `geprueft` (siehe Abschnitt 7) |

Abgeleitet und nie gespeichert werden: Akkorddauer, Taktstriche, Zähl-Anzeige (Takt/Schlag) und der Zeilentext.
Transponieren läuft wie heute über `transposeChord`.

**Bindung an eine Aufnahme** (eigene Datei, liegt privat):
```json
{"lied": "pokemon", "quelle": {"datei": "pokemon-de.mp3"}, "schlaege": [0.512, 1.031, 1.548]}
```

---

## 6. Die Ansicht: drei Spuren, ein Takt

Zum Ausprobieren: [`vorbild-mitspielen.html`](vorbild-mitspielen.html) (Doppelklick, Start, Tempo-Regler).

1. **Akkord-Bahn (Guitar Hero):** Akkordblöcke laufen von rechts auf eine feste Spiellinie zu. Die **Breite eines Blocks ist seine Dauer**,
   Taktstriche sind dünne Linien.
2. **Griff jetzt + Griff gleich:** großes Griffbild für den aktuellen Akkord, klein den nächsten, dazu ab einem Takt vorher
   der Countdown „gleich F in 3“.
3. **Text-Spur (SingStar):** Die aktuelle Zeile ist groß, die nächste klein darunter. Jede Silbe füllt sich über ihre Dauer mit Farbe.
   Der Akkordname steht über der Silbe, auf der gewechselt wird.
4. **Schlag-Spur:** ↓ ↑ je Achtel, der laufende Schlag leuchtet (Muster aus `PATTERNS`).

Betriebsarten:
- **Üben:** Tempo 50–100 %, ein Takt Einzählen, einen Abschnitt in Schleife.
- **Mit Aufnahme:** Die Uhr kommt aus der Aufnahme, alle Spuren folgen ihr.
- **Lagerfeuer:** dunkel, sehr groß, nur Zeile plus Akkord plus nächster Akkord, kein Klick, der Bildschirm bleibt an (Wake Lock).

---

## 7. Wie die Daten entstehen: drei Wege

**Weg A: Bestand übernehmen (alle 42 Lieder).** Ein einmaliges Skript (wie die Probe) überträgt die Akkorde exakt und die Silben
als `geschaetzt`. Danach kommen die Silben in den Tipp-Editor.

**Weg B: UltraStar-Datei einlesen (privat).** Silben, Zeit und Tonhöhe kommen fertig mit. Die Akkorde kommen aus dem Chart, wie der
Skill `ukulele-lehrbuch` sie heute schon aus zwei Quellen recherchiert, und werden auf Schläge gelegt. Achtung beim Umrechnen:
UltraStar-BPM ist laut Spezifikation idealerweise das Vierfache des Liedtempos. Den Faktor am ersten echten Lied gegenprüfen.

**Weg C: Aus einer eigenen Aufnahme selbst erzeugen** (Python am PC oder auf Jarvis, nicht in der App):
1. Gesang abtrennen und Silben mit Zeit erzeugen: **UltraSinger** (MIT, Demucs + Whisper + Silbentrennung, Deutsch unterstützt).
   Ergebnis ist eine UltraStar-Datei, danach geht es weiter wie bei Weg B.
2. Schläge und Takt-Eins finden: **Beat This!** (ISMIR 2024, MIT, `pip install beat-this`). Daraus wird die Schlagliste der Bindung.
3. Akkordvorschlag: **madmom** oder **BTC**, auf Schläge einrasten, auf Dur/Moll/7 vereinfachen und in eine Ukulelen-Tonart transponieren.
   Danach gegen das Chart prüfen.
4. Den Rest korrigiert der Tipp-Editor.

Dein Rechner hat keine NVIDIA-Grafik. Whisper „large“ braucht über 8 GB Grafikspeicher, also läuft alles auf der CPU oder mit kleinerem Modell.
Das ist langsam, fällt aber nur einmal je Lied an.

**Der Tipp-Editor ist das Herzstück** (für alle drei Wege):
- Das Lied läuft (Aufnahme, oder Metronom in langsamem Tempo, während du selbst singst).
- Taste oder Bildschirm **drücken = Silbe beginnt**, **loslassen = Silbe endet**. So arbeiten auch die UltraStar-Erstellwerkzeuge.
- Die Zeiten rasten auf Achtel ein, Sechzehntel lassen sich umschalten. Eine Zeile lässt sich in Schleife wiederholen, eine einzelne Silbe verschieben.
- Zum Probehören klickt die App auf jeder Silbe.
- **`geprueft` gilt erst**, wenn zwei unabhängige Durchgänge (zweimal getippt, oder getippt plus Pipeline) bei mindestens 90 % der Silben
  höchstens ein Sechzehntel auseinanderliegen. Das rechnet die App selbst aus.

---

## 8. Rechte: Die Konstruktionsregel bleibt

- **Öffentlich** (Repo, GitHub Pages): App-Code und gemeinfreie Lieder.
- **Nur privat:** Liedspuren mit geschütztem Text und alle Aufnahmen. Sie liegen als *Liedpaket*-Datei in deiner Nextcloud und werden in die App
  importiert (IndexedDB auf dem Gerät).
- **Automatischer Wächter:** `test/lieder.test.js` schlägt fehl (auch auf GitHub bei jedem PR), wenn im öffentlichen Ordner eine
  Liedspur mit `"gemeinfrei": false` und Text liegt.
  Damit ist die Regel nicht nur eine gute Absicht.
- **Audio:** Nimm eine eigene, gekaufte Datei. Das ist eine Privatkopie nach § 53 UrhG: natürliche Person, privat, keine
  offensichtlich rechtswidrige Vorlage. Alternativ geht das Einbetten über den offiziellen YouTube-Player. Herunterladen von YouTube verstößt gegen
  YouTubes Nutzungsbedingungen und ist deshalb kein Standardweg.
- **USDB-Dateien** enthalten geschützte Liedtexte. Ihr Rechtsstatus ist unklar, also nur privat nutzen und nicht weitergeben.
  *(Rechtliche Einschätzung, keine Rechtsberatung.)*

---

## 9. Architektur

**Empfehlung: Nur den Liederteil neu bauen, den Rest übernehmen.** Die Schwäche steckt im Liedmodell und im Mitspiel-Modus, nicht im Lehrbuch.
Übernommen werden die Kapitel, die Akkorddatenbank mit den Griffbildern (`p5-core.js`: `CHORDS`, `chordSVG`, `transposeChord`, `PATTERNS`),
der Stimmer (`p9-stimmer.js`) und der Übungsplan. *(Überholt am 24.10.2026: Jakob hat den Neuaufbau der ganzen App gewählt, ohne
`bauen.py`; siehe [`entscheidungen.md`](entscheidungen.md).)*

Bausteine, Abhängigkeiten zeigen nur nach unten:

| Baustein | Aufgabe | kennt |
|---|---|---|
| `ansicht` | drei Spuren, Griffe, Tipp-Editor | Uhr, Kern |
| `uhren` | Metronom-Uhr, Audio-Uhr, YouTube-Uhr; **eine** Frage: „Position in Vierteln jetzt?“ | Kern |
| `daten` | öffentliche Lieder, private Liedpakete (Import, IndexedDB), UltraStar-Import | Kern |
| `kern/liedspur` | rein, ohne Oberfläche: Position ↔ Takt/Schlag, Tempokarte, Position ↔ Sekunde (über Tempo oder Schlagliste), Akkord und Zeile bei einer Position, Transponieren | nichts |
| `pipeline/` (Python) | Weg C, läuft nur am PC/Server und schreibt Liedspur-Dateien | nichts von der App |

Getestet wird der Kern mit Node, ohne neue Abhängigkeit: Umrechnung hin und zurück, Tempowechsel, Auftakt, 3/4 und 6/8, Transponieren.
Der Skill `ukulele-lehrbuch` muss danach Liedspuren schreiben statt `SONGS`-Einträge.

---

## 10. Deine Wunschlieder

| Lied | heute | Weg | Besonderheit |
|---|---|---|---|
| Zum Geburtstag viel Glück, alle Volkslieder | Text da | A | nur Silben tippen |
| Das Lagerfeuerlied-Lied | kein Text | B oder C | Tempokarte: Teil B doppelt so schnell |
| Ich hab die Hose mir zerrissen | kein Text | C | Untertitel der Folge als Textquelle (Hinweis steht schon im Lied) |
| SpongeBob-Titelsong | kein Text | C | Ruf und Antwort → `stimme` |
| Pokémon (deutsch, 1. Staffel) | kein Text | B, falls in USDB (unbestätigt), sonst C | |
| Pippi, Biene Maja, DuckTales, Bob der Baumeister | kein Text | B oder C | |
| Griechischer Wein, Über sieben Brücken, Über den Wolken | kein Text | vermutlich B (beliebte Karaoke-Lieder, unbestätigt) | |
| Stand By Me, I'm Yours, Let It Be, Riptide, Zombie, Country Roads, Rainbow, Knockin' | kein Text | B, oder gleich Kala/Chord ai | |

---

## 11. Reihenfolge (80/20)

**Das Wesentliche zuerst:**
0. **Nur du, 15 Minuten:** Chord ai gratis an zwei Wunschliedern testen. Reicht dir das für die Popsongs, musst du nur für die Volkslieder und den Lagerfeuermodus bauen.
1. **Kern, Format und Übernahme der 42 Lieder** (Akkorde exakt, Silben geschätzt), dazu die Kern-Tests.
2. **Ansicht mit Metronom-Uhr:** das Vorbild auf echten Daten. Ab hier ist es am Lagerfeuer nutzbar.
3. **Tipp-Editor:** Damit stimmen die Silben der 23 Lieder mit Text.

Danach:
4. Private Liedpakete, UltraStar-Import und Audio-Uhr (eigene Aufnahme).
5. Pipeline (Weg C) für Lieder ohne UltraStar-Datei.

**Erweiterungen, bewusst nicht im Plan:** Tonhöhenbalken und Singbewertung (UltraStar liefert die Töne gratis mit), „warte auf mich“
mit Akkorderkennung über das Mikrofon (der Stimmer-Code wäre die Grundlage), Text auf den Handys der Mitsänger, Fußtaster zum Umblättern.

**Übernahme:** Aus dem Probe-Skript wurde [`werkzeug/uebernahme.js`](../werkzeug/uebernahme.js). Es hat alle 42 Lieder
nach `lieder/` übertragen (Stand 24.10.2026).

---

## 12. Offene Entscheidungen (deine)

Stehen als Ankreuzliste in `entscheidungen-mitspielen.html` (gleicher Ordner).
Was du wählst, kommt danach als Eintrag in `docs/entscheidungen.md`.

---

## Nebenbefunde (gemeldet, nicht behoben)

- **„Alle meine Entchen“, Verdacht** (aus Fachwissen, nicht gegen ein Notenbild geprüft): Zeile 2 hat für „schwimmen auf dem See“ (zweimal)
  nur zwei Takte. Nach der bekannten Melodie hat jede Silbe von „schwim-men auf dem“ denselben Notenwert wie „Al-le mei-ne“, das wären vier Takte.
  Der Tipp-Editor würde das sofort zeigen. Die Akkorde C/G7 statt C/F/G7 sind dagegen gewollt: Das Lied übt den ersten Wechsel C → G7.
- `README.md` nennt 26 Lieder, es sind 42.

## Quellen

- UltraStar-Format: https://usdx.eu/format/ · USDB: https://usdb.animux.de/
- UltraSinger: https://github.com/rakuri255/UltraSinger · Beat This!: https://github.com/CPJKU/beat_this
- madmom: https://pypi.org/project/madmom/ · BTC: https://github.com/qf6101/BTC-ISMIR19
- ChordPro: https://www.chordpro.org/chordpro/chordpro-introduction/
- Chord ai: https://apps.apple.com/app/1446177109 · Kala Ukulele: https://apps.apple.com/US/app/id1064893690
- Chordify mit Texten: https://www.musicradar.com/news/chordify-lyrics-live-chord-detection · Yousician: https://yousician.com/ukulele, Preise: https://www.guitarchalk.com/yousician-cost/
- § 53 UrhG: https://www.gesetze-im-internet.de/urhg/__53.html
- Entchen-Akkorde C-F-G7: https://www.guitartabsexplorer.com/misc-children/alle-meine-entchen-ukulele-chords
