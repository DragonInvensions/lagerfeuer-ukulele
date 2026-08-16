# Lagerfeuer-Ukulele

Ein Ukulele-Lehrbuch von null bis Lagerfeuer — als einzelne, in sich geschlossene
HTML-Datei. Kein Server, keine Abhängigkeiten, kein Internet nötig.

**→ [Buch öffnen](https://dragoninvensions.github.io/lagerfeuer-ukulele/)**

## Was drin ist

- **8 Kapitel Handwerk** — Instrument und Stimmung, Griffbilder lesen, die ersten drei
  Griffe, Rhythmus, die Lagerfeuer-Griffe, Barré, Transponieren, und wie man tatsächlich
  vor Menschen spielt.
- **26 Lieder** in vier Schwierigkeitsstufen, jeweils mit Takt-Raster, Griffbildern,
  Schlagmuster und Transponier-Knopf.
- **28 Griffbilder**, aus einer Akkorddatenbank als SVG erzeugt — mit Fingersatz-Nummern.
- **6 Schlagmuster mit Klick-Player** — man hört den Takt und sieht, welcher Schlag dran ist.
- **Stimmton** für die vier Leersaiten (g–C–E–A) über die Web Audio API.
- **8-Wochen-Übungsplan** mit Häkchen, die im Browser gespeichert bleiben.
- Hell/Dunkel, für Handy gebaut, druckbar.

Alles läuft im Browser, ohne Backend. Eingetragene Liedtexte und abgehakte Übungen
liegen ausschließlich im `localStorage` des jeweiligen Geräts und verlassen es nie.

## Zu den Liedtexten

Die Texte urheberrechtlich geschützter Lieder sind **absichtlich nicht enthalten**.
Was drinsteht, ist das Akkord-Raster: Takt für Takt, eine Zeile pro Textzeile des
Originals. Unter jeder Zeile steht ein nummeriertes Eingabefeld, in das man den Text
selbst einträgt. Bei gemeinfreien Liedern (Volkslieder, Traditionals, *Happy Birthday*)
steht der Text vollständig da.

Die Akkordfassungen sind vereinfachte Begleitversionen für Anfänger. Wo die Akkorde
gegen veröffentlichte Charts abgeglichen wurden, ist das Lied im Buch mit **geprüft**
markiert und die Quelle verlinkt.

## Aufbau

```
index.html               ← gebautes Buch (Einstiegsseite für GitHub Pages)
Ukulele-Lehrbuch.html    ← identische Kopie unter sprechendem Namen
quelle/
  p1-style.html            Styles und Farbtokens
  p2-shell.html            Kopf, Inhaltsverzeichnis, Hero, Kapitel 1–3
  p3-chapters.html         Kapitel 4–8 und Akkord-Lexikon
  p4-tail.html             Liederteil-Rahmen, Übungsplan, Werkzeugkasten
  p5-core.js               Akkorddatenbank, Griffbild-SVG, Transponieren, Audio
  p6-songs-a.js            Lieder, Teil A
  p7-songs-b.js            Lieder, Teil B
  p8-render.js             Rendern von Liedern, Plan und Filtern
  bauen.py                 setzt alles zusammen
  veroeffentlichen.ps1     PowerShell-Skript, nur für Windows
```

Die gebauten Dateien werden **nicht von Hand bearbeitet**. Änderungen gehen in die
Teildateien unter `quelle/`, danach:

```bash
python3 quelle/bauen.py      # unter Windows: python quelle\bauen.py
```

Das erzeugt `index.html`, `Ukulele-Lehrbuch.html` und `quelle/body.html`. Alle drei
gehören in denselben Commit — `index.html` ist die Seite, die GitHub Pages ausliefert.

Zum Ansehen genügt ein Doppelklick auf `Ukulele-Lehrbuch.html`. Wer lieber über HTTP
prüft:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

## Mitarbeiten

Ein Thema pro Branch, ein Branch pro Pull Request, gemergt wird von Hand. Der Ablauf,
die Projektkarte für neue Mitleser und die bekannten Fallstricke stehen in
[`CLAUDE.md`](CLAUDE.md).

Offene Issues werden von einem Autopiloten selbsttätig umgesetzt, der daraus Pull
Requests öffnet. Issues mit dem Label `kein-autopilot` bleiben unangetastet.

## Lizenz

Der Text und der Code des Lehrbuchs stehen unter der MIT-Lizenz (siehe `LICENSE`).
Die behandelten Lieder selbst sind davon nicht berührt — Rechte an Melodien und Texten
liegen bei den jeweiligen Urhebern und Verlagen.
