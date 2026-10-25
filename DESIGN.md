---
name: Lagerfeuer-Ukulele
description: "Das Liederbuch vom Lagerfeuer, für die Nacht umgedreht: Akkord über der Silbe, und die Seite läuft im Takt."
colors:
  rot: "#d2342a"
  rot-schrift: "#f0705f"
  rot-hover: "#e03c31"
  gelb: "#f0c419"
  grund: "#141110"
  seite: "#1f1a18"
  seite-hoch: "#2a2320"
  papier: "#efe9dd"
  papier-leise: "#c9c0b3"
  leise: "#9a8f83"
  strich: "#3a312c"
  punkt-schrift: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "46px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  lyric-current:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 8.6vw, 40px)"
    fontWeight: 600
    lineHeight: 1.1
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  lyric-next:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.1
  lyric-previous:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.1
  chord-letter:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "max(19px, 0.5em)"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  lyric-current-laptop:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(40px, 6.4vh, 66px)"
    fontWeight: 600
    lineHeight: 1.1
  lyric-next-laptop:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(21px, 3.2vh, 32px)"
    fontWeight: 400
    lineHeight: 1.1
  chord-name-laptop:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(46px, 7.5vh, 88px)"
    fontWeight: 800
    lineHeight: 1
  lyric-current-fire:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(36px, 10.5vw, 52px)"
    fontWeight: 600
    lineHeight: 1.1
  chord-name-fire:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "60px"
    fontWeight: 800
    lineHeight: 1
  list-heading:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.4
  list-number:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 0.9
  list-title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  list-subtitle:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
  full: "50%"
spacing:
  rand: "clamp(16px, 5vw, 28px)"
  leiste-hoehe: "104px"
components:
  button-start:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.punkt-schrift}"
    rounded: "{rounded.full}"
    size: "72px"
  button-start-hover:
    backgroundColor: "#e03c31"
  toggle:
    textColor: "{colors.papier}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "5px 8px"
    height: "52px"
    width: "64px"
  toggle-hover:
    backgroundColor: "{colors.seite-hoch}"
  toggle-pressed:
    backgroundColor: "{colors.seite-hoch}"
    textColor: "{colors.papier}"
  tempo-stepper:
    textColor: "{colors.papier}"
    rounded: "{rounded.lg}"
    height: "52px"
  tempo-stepper-disabled:
    textColor: "{colors.strich}"
  back-button:
    textColor: "{colors.leise}"
    rounded: "{rounded.md}"
    size: "44px"
  back-button-hover:
    backgroundColor: "{colors.seite}"
    textColor: "{colors.papier}"
  bottom-bar:
    backgroundColor: "{colors.seite}"
    padding: "14px clamp(16px, 5vw, 28px) 16px"
    height: "{spacing.leiste-hoehe}"
  song-number:
    textColor: "{colors.rot}"
    typography: "{typography.display}"
  song-number-count-in:
    textColor: "{colors.gelb}"
  thread:
    backgroundColor: "{colors.seite}"
    height: "60px"
  thread-block-now:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.punkt-schrift}"
    typography: "{typography.title}"
    height: "42px"
  thread-block-next:
    textColor: "{colors.gelb}"
    typography: "{typography.title}"
    height: "42px"
  thread-block-past:
    textColor: "{colors.leise}"
    height: "26px"
  chord-diagram:
    backgroundColor: "{colors.seite}"
    textColor: "{colors.papier}"
    rounded: "{rounded.lg}"
    padding: "8px 8px 4px"
  chord-next:
    textColor: "{colors.gelb}"
    typography: "{typography.label}"
  strum-cell:
    textColor: "{colors.leise}"
    height: "50px"
  strum-cell-active:
    textColor: "{colors.papier}"
  song-row:
    textColor: "{colors.papier}"
    padding: "12px 0"
  level-heading:
    textColor: "{colors.rot-schrift}"
  chip-marke:
    textColor: "{colors.leise}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# Design System: Lagerfeuer-Ukulele

## Overview

**Creative North Star: "Mundorgel bei Nacht"**

Das Liederbuch vom Lagerfeuer, in der Hand gehalten und im Dunkeln gelesen. Wie in der Mundorgel steht der Akkord über der Silbe, auf der gewechselt wird; anders als auf Papier bewegt sich die Seite im Takt. Die Fläche ist warmes Schwarz, die Schrift dünnes Elfenbein, und genau zwei Signalfarben tragen die Zeit: Rot für das, was jetzt klingt, Gelb für das Gesungene und das Nächste.

Maß und Dichte kommen vom Einsatzort: Telefon auf dem Knie oder am Ständer, eine Armlänge entfernt, beide Hände an der Ukulele. Was gelesen werden muss, ist groß und fett; was nur Orientierung gibt, tritt in Asche zurück. Gedrückt wird fast nur der rote Startknopf in der festen Leiste unten.

Abgelehnt sind die Karaoke-Neonautobahn (Leuchten, Verläufe, Bahnen in Perspektive) und das cremefarbene Papier-Liederbuch. Bewegung gibt es genau einmal: Der Lesefaden gleitet stetig unter der Nadel durch, und die gesungene Silbe füllt sich mit Gelb. Alles andere schaltet ohne Animation.

**Key Characteristics:**
- Warmes Schwarz als Grund, drei Tonstufen statt Schatten.
- Rot heißt „jetzt“, Gelb heißt „gesungen“ und „als Nächstes“; keine weitere Akzentfarbe.
- Eine Schrift, Archivo, in drei Gewichten; Akkordbuchstaben immer 800.
- Akkord über der Silbe, und die Seite läuft im Takt.
- Eine einzige stetige Bewegung, sonst hartes Umschalten.
- Lesbar aus Armlänge im Dunkeln; ein Akkordwechsel zeigt sich nie nur über Farbe.

## Colors

Eine warme Nachtpalette aus Schwarz, Ruß und Elfenbein, dazu zwei Signalfarben mit jeweils festen Aufgaben.

### Primary
- **Mundorgel-Rot** (#d2342a): das Signal für „jetzt“ und die Kennung des Liedes. Seine Aufgaben, abschließend: die Liednummer (im Kopf 64px, in der Liste 24px), der laufende Akkord als einzige rote Platte im Lesefaden, der Lesefaden selbst (3px-Oberkante) mit seiner Nadel, der Startknopf und die Akkordbuchstaben der Zeile, die gerade klingt. Zum selben „jetzt“ gehören die Fingerpunkte im Griffbild des laufenden Akkords und die Unterstreichung der Schlagzelle, die gerade dran ist; die Textauswahl ist ebenfalls rot hinterlegt. Kontrast 3,82:1 auf dem Grund und 3,50:1 auf der Seite: genug für Flächen, Grafik und große Schrift, nicht für kleine.
- **Mundorgel-Rot, Schriftfassung** (#f0705f): dieselbe Farbe, für Lesbarkeit aufgehellt, keine zweite Akzentfarbe. Nur für rote Schrift unter 19px, 6,43:1 auf dem Grund. Heute trägt sie einzig die Stufen-Überschriften der Liederliste.

### Secondary
- **Glutgelb** (#f0c419): das Gesungene und das Nächste. Genau zwei Aufgaben: die Füllung der Silbe, die gerade gesungen wird (sie wächst mit der Zeit von links nach rechts), und der nächste Akkord (sein Block im Lesefaden und die Zeile „dann G7 · in 1 Schlag“). Dazu die Einzähl-Zahl: Beim Einzählen zählt die Liednummer den Takt in Gelb 1-2-3-4. Kontrast 11,29:1 auf dem Grund.

### Neutral
- **Feuernacht** (#141110): Grund der ganzen App, auch Browser-Leiste (`theme-color`) und Spur des Scrollbalkens.
- **Rußseite** (#1f1a18): die Seite über dem Grund: Lesefaden, Griffbild-Kachel, feste Leiste, Hover des Zurück-Pfeils.
- **Gehobene Seite** (#2a2320): Hover und gedrückter Zustand der Umschalter und Tempo-Tasten.
- **Dünndruck-Elfenbein** (#efe9dd): Schrift, Symbole, Linien des Griffbilds, Wiederholungszeichen, Fokusring und Rand des gedrückten Umschalters. 15,54:1 auf dem Grund.
- **Leises Elfenbein** (#c9c0b3): die kommende Zeile und die Akkordbuchstaben der Nachbarzeilen. 10,45:1 auf dem Grund.
- **Asche** (#9a8f83): alles, was nur orientiert: Untertitel, Takt-Zähler, vorige Zeile, vergangene Akkorde, ruhende Schlagzellen, Hinweise, Lade- und Fehlerzustand. 5,93:1 auf dem Grund, 5,44:1 auf der Seite.
- **Haarlinie** (#3a312c): Takt- und Schlagstriche, Trennlinien der Liste, Ränder der Bedienelemente, ruhende Schlag-Unterstreichung, gesperrte Tempo-Taste. Die Richtungsvorgabe nannte #332b27; gebaut und gültig ist der etwas hellere Wert.
- **Reinweiß auf Rot** (#ffffff): nur Schrift und Symbole auf roter Fläche: Startsymbol, Name in der roten Platte, Fingernummern im Griffbild, ausgewählter Text. 4,92:1 auf Mundorgel-Rot.

Alle Neutraltöne sind warm (Farbton in OKLCH etwa 40 bis 85 Grad). Das dunkelgrüne App-Zeichen im Kopf der Liederliste ist kein Systemton; ob es bleibt, ist noch nicht entschieden.

### Named Rules
**The One Red Plate Rule.** Rot heißt „jetzt“ oder „dieses Lied“, nie Schmuck. Im Lesefaden gibt es genau eine rote Platte, den laufenden Akkord; jede zusätzliche rote Fläche außer dem Startknopf nimmt ihr die Eindeutigkeit.

**The Two Reds Rule.** Mundorgel-Rot (#d2342a) trägt nur Flächen und Schrift ab 19px fett, denn mit 3,82:1 auf dem Grund besteht es nur als große Schrift. Rote Schrift darunter nimmt die Schriftfassung (#f0705f, 6,43:1). Die Schriftfassung ist eine Kontrast-Anpassung, keine zweite Akzentfarbe: nie als Fläche, nie für eine neue Aufgabe.

**The Sung-and-Next Rule.** Gelb hat genau zwei Aufgaben, die gesungene Silbe und den nächsten Akkord, dazu die Einzähl-Zahl. Gedrückte Umschalter und Fokusringe sind Elfenbein, nie Gelb.

## Typography

**Display Font:** Archivo (mit Helvetica Neue, Arial, sans-serif)
**Body Font:** Archivo (dieselbe Familie)

**Character:** Eine kräftige Grotesk mit offenen, breiten Formen, die in 800 auch auf Armlänge als Zeichen steht und in 400 ruhig liest. Hierarchie entsteht aus Größe, Gewicht und Farbe, nie aus einer zweiten Schrift.

### Hierarchy
- **Display** (800, 64px, 0.9, -0.03em, Tabellenziffern): die Liednummer im Kopf des Mitspielens; beim Einzählen zählt sie den Takt.
- **Headline** (800, 46px, 1, -0.02em): der Name des laufenden Akkords neben dem Griffbild. Im Feuermodus 60px, am Laptop clamp(46px, 7.5vh, 88px).
- **Lyric current** (600, clamp(30px, 8.6vw, 40px), 1.1, ausgeglichener Umbruch): die Zeile, die gerade gesungen wird. Im Feuermodus clamp(36px, 10.5vw, 52px), am Laptop clamp(40px, 6.4vh, 66px).
- **Title** (800, 21px, 1.15, -0.01em): der Liedtitel im Kopf (ausgeglichener Umbruch) und die Akkordnamen in den Blöcken des Lesefadens.
- **Lyric next** (400, 21px, 1.1): die kommende Zeile in Leisem Elfenbein; am Laptop clamp(21px, 3.2vh, 32px).
- **Lyric previous** (400, 19px, 1.1): die vorige Zeile in Asche, schwach, aber lesbar.
- **Chord letter** (800, max(19px, 0.5em), 1): der Akkordbuchstabe über der Silbe in der klingenden Zeile, rot. In den Nachbarzeilen steht er in 0.7em und Leisem Elfenbein.
- **Body** (400, 17px, 1.4): Grundschrift. Die Tempoanzeige nutzt sie in 600 mit Tabellenziffern.
- **Label** (600, 15px): „dann G7 · in 1 Schlag“ in Gelb. Dieselben 15px in 800 tragen die Stufen-Überschriften der Liste und die Namen vergangener Akkorde.
- **Meta** (400, 14px): Stufe · Tonart · Abschnitt, Takt-Zähler, Hinweise (höchstens 46ch breit).
- **Caption** (600, 12px): Beschriftung der Umschalter.

### Named Rules
**The Chord Above Syllable Rule.** Der Akkordbuchstabe steht über genau der Silbe, auf der gewechselt wird, immer in 800. Jede Silbe trägt ihre eigene Akkordzeile, damit umbrochene Zeilen nicht ineinanderlaufen; ein Wort bricht als Ganzes um, nur ein Wort, das länger als die Zeile ist, bricht an seinen Silben.

**The Three Weights Rule.** Archivo nur in 400, 600 und 800: 800 für Zahlen, Akkorde und Titel, 600 für die klingende Zeile und die Bedienung, 400 für Fließtext und Nachbarzeilen. Was zählt (Liednummer, Tempo, Takt), steht in Tabellenziffern, damit nichts springt.

## Layout

Eine Spalte, mobil zuerst, höchstens 640px breit und mittig. Am Laptop (ab 900px Breite und 700px Höhe) wird sie 860px breit, und Text, Akkordname und Griffbild wachsen mit der Höhe des Bildschirms, nicht mit seiner Breite. Der Seitenrand ist überall `rand` (clamp(16px, 5vw, 28px)); nur der Lesefaden läuft randlos über die volle Breite. Kopf und feste Leiste halten die Safe-Area-Ränder ein.

Das Mitspielen ist ein Stapel von Spuren auf einem Takt, von oben nach unten: Kopf (Zurück-Pfeil, Liednummer, Titel mit Stufe · Tonart · Abschnitt), Lesefaden, Griff (Griffbild, Akkordname mit „dann …“, Takt-Zähler rechts oben; Raster auto / 1fr / auto mit 18px Lücke), Liedtext, Schlagzeile. Der Liedtext bekommt den freien Raum und steht senkrecht mittig; die Schlagzeile sitzt direkt über der festen Leiste, für die unten `leiste-hoehe` plus Safe-Area plus 14px frei bleibt.

Die Abstände folgen der Lesefolge, keinem starren Raster: 4px zwischen Schlagzellen, 10px zwischen den Elementen der Leiste, 14 bis 16px zwischen den Textzeilen, 18 bis 26px zwischen den Spuren, 30px vor jeder Stufe der Liederliste.

### Named Rules
**The Fire Mode Rule.** Der Feuermodus nimmt weg, statt hinzuzufügen: vorige Zeile, Schlagzeile, Takt-Zähler und Hinweis verschwinden, klingende Zeile und Akkordname werden größer. Farben und Formen bleiben gleich.

**The Thumb Bar Rule.** Was man beim Spielen drückt, liegt in der festen Leiste unten, mittig gruppiert. Der Startknopf ist das größte Ziel (72px), kein anderes Ziel ist kleiner als 44px.

## Elevation & Depth

Flach. Keine Schatten, keine Verläufe, kein Leuchten. Tiefe entsteht aus drei warmen Tonstufen (Feuernacht, Rußseite, Gehobene Seite) und aus Haarlinien: Die feste Leiste ist Rußseite mit einer 1px-Oberkante, die Griffbild-Kachel Rußseite ohne Rand, Hover und gedrückter Zustand heben auf die Gehobene Seite. Die einzige Abstufung innerhalb eines Elements ist die Deckkraft der Linien im Griffbild.

### Named Rules
**The Flat Night Rule.** Ebenen unterscheiden sich nur durch Ton und Linie. Ein Schatten oder ein Leuchten macht aus der Nacht eine Karaoke-Bühne.

## Shapes

Weich ist nur, was man drückt oder in der Hand hält: Marke und Fokusring 6px; Zurück-Pfeil, Tempo-Tasten, Textknopf und App-Zeichen 10px; Griffbild-Kachel, Tempo-Gruppe und Umschalter 12px; der Startknopf ein voller Kreis. Was Zeit zeigt, ist kantig wie ein Lineal: Lesefaden und Akkordblöcke haben keine Rundung, jeder Block ist so breit wie seine Dauer und links durch eine 2px-Haarlinie getrennt.

Linienstärken haben feste Rollen: 1px für Takt- und Schlagstriche und die Trennlinien der Liste, 1.5px für die Ränder der Bedienelemente, 2px für Blockgrenzen und Symbolstriche, 3px für Marken (Oberkante des Lesefadens, Schlag-Unterstreichung, Fokusring).

Die Zeichen kommen aus dem Notensatz: Die Nadel ist ein rotes Dreieck (18 × 12px) an der Oberkante bei 22 % der Breite; eine Schleife zeigt Wiederholungszeichen auf dem Faden (4px-Balken in Elfenbein mit zwei Punkten, am Ende gespiegelt). Die Symbole sind eine Familie auf einem 24er-Raster, Strich 2, runde Enden; gefüllt sind nur das Startdreieck und der Pausenpunkt.

## Components

### Buttons
Wenige, große, ruhige Ziele; nur eines ist rot.
- **Shape:** Startknopf voller Kreis (72px), Umschalter und Tempo-Gruppe sanft gerundet (12px), Zurück-Pfeil und Textknopf (10px).
- **Primary:** der Startknopf in Mundorgel-Rot mit 30px-Symbol in Reinweiß. Er wechselt zwischen Start und Pause (Beschriftung „Abspielen“ / „Anhalten“); die Leertaste schaltet ebenso.
- **Hover / Focus:** Start hellt auf #e03c31 auf, Umschalter und Tempo-Tasten heben auf die Gehobene Seite. Fokus überall als 3px-Ring in Elfenbein mit 3px Abstand. Kein Übergang, der Wechsel ist sofort.
- **Umschalter (Schleife, Feuer):** mindestens 64 × 52px, 1.5px Haarlinien-Rand, Symbol 22px über der Beschriftung. Gedrückt (`aria-pressed="true"`): Rand Elfenbein, Fläche Gehobene Seite.
- **Tempo:** eine Gruppe, 52px hoch, 1.5px Rand; Minus und Plus je 44px breit, dazwischen der Wert in 600 mit Tabellenziffern (50 bis 100 %). Am Anschlag ist die Taste gesperrt und zeigt ihr Symbol in Haarlinie.
- **Zurück:** 44px, Symbol in Asche; beim Hover Elfenbein auf Rußseite.
- **Textknopf** (Fehlerzustand, „Zur Liederliste“): Innenabstand 12px 18px, 1.5px Haarlinien-Rand, Gewicht 600.

### Chips
- **Style:** die Marke „nur Akkorde“ in der Liederliste: 12px in Asche, Gewicht 400, 1px Haarlinien-Rand, 6px Rundung, Innenabstand 2px 6px, keine Fläche.
- **State:** nur Auskunft, nicht antippbar.

### Navigation
- **Liederliste:** Kopf mit App-Zeichen (44px) und Titel (26px, 800, -0.02em). Je Stufe eine Überschrift in der Schriftfassung des Rots (15px, 800). Jede Zeile ist ein Link als Raster 2.4ch / 1fr / auto mit 14px Lücke, 12px Innenabstand oben und unten und einer 1px-Haarlinie darunter: rote Nummer rechtsbündig (24px, 800, Tabellenziffern), Titel 18px in 600, darunter der Untertitel 13px in 400 und Asche, rechts gegebenenfalls die Marke.
- **Mitspielen:** der Zurück-Pfeil links im Kopf führt zur Liste. Bedienung während des Spielens liegt nur in der festen Leiste: Rußseite mit 1px-Haarlinie oben, Start, Tempo, Schleife, Feuer mittig mit 10px Lücke.

### Lesefaden (Signature Component)
Der Akkord-Zeitstrahl, das Wiedererkennungsstück der App.
- Randlos, 60px hoch, Rußseite, 3px rote Oberkante. Taktstriche über die volle Höhe und 8px kurze Schlagstriche, beide 1px Haarlinie, bilden das gemeinsame Raster.
- Akkordblöcke sind 42px hoch und so breit wie ihre Dauer, der Name steht in Title. Vergangene Blöcke schrumpfen auf 26px Höhe und 15px Schrift in Asche; der laufende Block ist die rote Platte mit weißem Namen, der an der Nadel stehen bleibt, statt links hinauszulaufen; der nächste Block schreibt seinen Namen in Gelb.
- Rechts der Nadel stehen immer zwei Takte, mindestens 26px je Viertel.
- **The One Glide Rule.** Der Lesefaden ist das Einzige, das stetig gleitet, an die Musikuhr gebunden und je Bild verschoben; die gelbe Silbenfüllung ist dieselbe Uhr im Text. Alles andere schaltet ohne Übergang. Diese Bewegung ist der Spielkopf selbst, keine Dekoration; dekorative Bewegung kommt nicht dazu.

### Griff jetzt und gleich
- Griffbild-Kachel: Rußseite, 12px Rundung, Innenabstand 8px 8px 4px. Saiten G C E A von links, Sattel oben als Balken in Elfenbein; Bundstäbe Elfenbein mit 40 % Deckkraft, Saiten 60 %, leere Saiten als Ring mit 70 %; Fingerpunkte rot mit weißer Fingernummer in 800. Gezeichnet in 77.5 × 92.5px, am Laptop clamp(78px, 12vh, 128px) breit.
- Daneben der Akkordname (Headline), darunter „dann X · in n Schlägen“ in Gelb (Label), am Liedende „Schluss“. Rechts oben der Takt-Zähler in Asche („Takt 2 · 4“, beim Einzählen „einzählen“).

### Liedtext
- Drei Zeilen: vorige (Lyric previous, Asche), klingende (Lyric current, 14px Abstand darüber), kommende (Lyric next, Leises Elfenbein, 16px Abstand darüber). Die Akkordzeile über den Silben ist 0.82em hoch, in der klingenden Zeile max(24px, 0.64em).
- Die gesungene Silbe füllt sich von links mit Gelb, nur in der klingenden Zeile.
- Lieder ohne freigegebenen Text zeigen dieselbe Zeile als Akkordfolge (jeder Wechsel ein Wort in 800, mit gelber Füllung) und darunter einen Hinweis in Meta.

### Schlagzeile
- Eine Zelle je Achtel, alle gleich breit, 4px Lücke, 50px hoch, Symbol 26px (ab, auf, Chunk, Pausenpunkt) über einer 3px-Unterstreichung in Haarlinie. Die Zelle, die gerade dran ist, zeigt ihr Symbol in Elfenbein und ihre Unterstreichung in Rot. Kein Kasten, keine Füllung.

### Zustände
- Laden und Fehler stehen mittig bei 40 % der Höhe in Asche; der Fehler bietet einen Textknopf zurück zur Liste.

## Do's and Don'ts

### Do:
- **Do** Rot nur für seine Aufgaben einsetzen: Liednummer, die eine rote Platte des laufenden Akkords samt Fingerpunkten im Griffbild, Lesefaden mit Nadel, Startknopf, Akkordbuchstaben der klingenden Zeile, Unterstreichung der laufenden Schlagzelle.
- **Do** rote Schrift unter 19px in der Schriftfassung (#f0705f, 6,43:1) setzen; Mundorgel-Rot (#d2342a) trägt nur Flächen und Schrift ab 19px fett.
- **Do** Gelb nur für die gesungene Silbe, den nächsten Akkord und die Einzähl-Zahl verwenden.
- **Do** gedrückte Zustände mit Elfenbein-Rand auf der Gehobenen Seite zeigen und Fokus mit dem 3px-Ring in Elfenbein (3px Abstand).
- **Do** einen Akkordwechsel immer auch über Ort und Text zeigen: Platte unter der Nadel, neuer Name, „dann X · in n Schlägen“.
- **Do** zählende Zahlen in Tabellenziffern setzen.
- **Do** am Laptop über die Bildschirmhöhe skalieren, am Telefon über die Breite.

### Don't:
- **Don't** Rot für weitere Aufgaben verwenden, auch nicht für Hinweise, Fehler oder Links; jede zusätzliche rote Fläche schwächt die eine Platte.
- **Don't** Gelb eine dritte Aufgabe geben: weder Hover noch gedrückter Zustand, Fokus oder Links.
- **Don't** Schatten, Verläufe oder Leuchten verwenden; keine Karaoke-Neonautobahn.
- **Don't** den Grund hell oder cremefarben machen; das Papier-Liederbuch wird umgedreht, nicht nachgebaut.
- **Don't** Zustandswechsel animieren (Blenden, Gleiten, Federn); stetig bewegt sich nur der Lesefaden.
- **Don't** eine zweite Schrift oder ein viertes Gewicht einführen.
- **Don't** Zeitblöcke runden oder in Karten verpacken; Zeit ist ein Lineal.
