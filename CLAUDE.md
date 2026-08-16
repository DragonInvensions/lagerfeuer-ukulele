# Lagerfeuer-Ukulele

## Worum es geht

Ein deutschsprachiges Ukulele-Lehrbuch für Anfänger, das als **eine einzige HTML-Datei**
ausgeliefert wird — kein Server, kein Build-Werkzeug, keine Abhängigkeiten, kein Internet
zur Laufzeit. Es enthält acht Kapitel Handwerk, 26 Lieder mit Takt-Raster und
Transponier-Knopf, aus einer Akkorddatenbank erzeugte Griffbilder als SVG, sechs
Schlagmuster mit Klick-Player (Web Audio), einen Stimmton und einen 8-Wochen-Übungsplan
zum Abhaken. Veröffentlicht wird es über GitHub Pages
(<https://dragoninvensions.github.io/lagerfeuer-ukulele/>).

Alles läuft im Browser. Es gibt kein Backend und keine Datenbank; was Nutzer eintragen
(eigene Liedtexte, abgehakte Übungen, Hell/Dunkel), liegt ausschließlich im `localStorage`
des Geräts.

## Wo was liegt

| Ordner | Inhalt |
|---|---|
| `quelle/` | **Der einzige Ort, an dem gearbeitet wird.** Acht Teildateien plus Bauskript. |
| `.claude/skills/` | Gemeinsame Skills (siehe unten). Nicht verändern. |
| `.github/ISSUE_TEMPLATE/` | Issue-Vorlagen für den Autopiloten (Funktion, Fehler, Aussehen). |
| *(Wurzel)* | `index.html` und `Ukulele-Lehrbuch.html` — **gebaut, nie von Hand ändern**; dazu `README.md`, `LICENSE`, `.gitignore`, diese Datei. |

Die Teildateien in `quelle/` werden vom Bauskript in genau dieser Reihenfolge
aneinandergehängt:

| Datei | Inhalt |
|---|---|
| `p1-style.html` | Alle Styles und Farbtokens (`:root`), Dunkelmodus, Druckansicht |
| `p2-shell.html` | Kopf, Inhaltsverzeichnis, Hero, Kapitel 1–3 |
| `p3-chapters.html` | Kapitel 4–8 und Akkord-Lexikon |
| `p4-tail.html` | Rahmen des Liederteils, Übungsplan, Werkzeugkasten, Footer |
| `p5-core.js` | Akkorddatenbank `CHORDS`, Griffbild-SVG, Transponieren, Audio, `PATTERNS`, `store`/`load` |
| `p6-songs-a.js` | öffnet `<script>` und `var SONGS = [`, Lieder Teil A |
| `p7-songs-b.js` | Lieder Teil B, schließt `];` und `</script>` |
| `p8-render.js` | Rendert Lieder, Übungsplan und Filter; hängt die Eventlistener ein |
| `bauen.py` | Setzt alles zusammen |
| `veroeffentlichen.ps1` | PowerShell, **nur für Jakobs Windows-PC** — hier nicht ausführbar |

## Womit man anfängt

1. **`quelle/bauen.py`** (50 Zeilen) — erklärt in seinem Docstring den kompletten Bauplan
   und warum die Reihenfolge der Teildateien bindend ist. Danach weiß man, wie das Projekt
   funktioniert.
2. **`quelle/p5-core.js`** — hier hängt alles dran: Akkordformat, Griffbild-Erzeugung,
   Transponierlogik, Audio, Speicherhilfen. Wer diese Datei verstanden hat, kann jede
   andere lesen.
3. **`README.md`** — Produktsicht plus die Urheberrechtsregel zu den Liedtexten, die man
   kennen muss, bevor man einen Text ins Repo schreibt.

Für das Datenformat der Lieder genügt danach ein Blick auf die ersten 40 Zeilen von
`quelle/p6-songs-a.js`.

## Starten, bauen, prüfen

Es gibt **keine `package.json`, keine Testsuite und keine CI**. Alles läuft über diese
Befehle (auf diesem Server heißt der Interpreter `python3`, nicht `python`):

```bash
# Bauen — erzeugt index.html, Ukulele-Lehrbuch.html und quelle/body.html
python3 quelle/bauen.py

# Lokal ansehen (Dev-Server nur an 127.0.0.1 binden), dann http://127.0.0.1:8080/
python3 -m http.server 8080 --bind 127.0.0.1

# JS-Syntax der vier Skriptteile prüfen (sie ergeben nur zusammen gültiges JavaScript)
sed -e 's|</\?script>||g' quelle/p5-core.js quelle/p6-songs-a.js \
    quelle/p7-songs-b.js quelle/p8-render.js > /tmp/uke-check.js \
  && node --check /tmp/uke-check.js && echo "JS-Syntax ok"
```

Die eigentliche Prüfung ist visuell: nach jeder sichtbaren Änderung die gebaute Seite
ansehen (Skill `screenshot-verify`, Chromium headless), in Handy- **und** Desktop-Breite,
und einmal in Hell und Dunkel.

`quelle/veroeffentlichen.ps1` ist ein Windows-Skript, das direkt auf `main` pusht und
GitHub Pages einschaltet. Es wird hier **nicht** aufgerufen — Veröffentlichung passiert
über Pull Request und Merge.

## Skills in diesem Repo

Liegen unter `.claude/skills/`, sind fertig und werden nicht verändert.

| Skill | Wann nehmen |
|---|---|
| `arbeitsablauf` | Immer am Anfang und vor jedem Commit: Branchschnitt, Commit-Nachricht, PR, Selbstprüfung |
| `issue-umsetzen` | Wenn der Auftrag aus einem GitHub-Issue kommt und ohne Rückfragen fertig werden muss |
| `frontend-design` | Wenn Aussehen, Typografie oder Farbwelt geändert werden — nicht bei reiner Logik |
| `animationen` | Übergänge, Hover, Feedback, „wirkt träge/billig" — Vanilla JS/CSS, kein Framework |
| `higgsfield-medien` | Wenn Bilder, Grafiken, Icons oder Videos erzeugt werden sollen (kostet Credits) |

## So entsteht hier Code

Ein Thema → ein Branch → ein Pull Request. Nie auf `main` arbeiten, nie selbst mergen —
das macht Jakob. Verbindlich ist der Skill **`arbeitsablauf`**; er enthält Branchnamen,
Commit-Stil (deutsch, Imperativ) und die Selbstprüfliste.

```bash
git switch -c feature/<thema> origin/main
python3 quelle/bauen.py          # gebaute Dateien mitcommitten
git commit -am "Kurze deutsche Beschreibung"
git push -u origin feature/<thema>
gh pr create --base main
```

Auf dem Sekretär-Server läuft ein **Autopilot**, der offene GitHub-Issues dieses Repos
selbsttätig umsetzt und daraus Pull Requests öffnet — ohne Rückfrage, weil niemand
erreichbar sein muss. Wie so ein Lauf abläuft, steht im Skill **`issue-umsetzen`**.
Issues mit dem Label **`kein-autopilot`** bleiben unangetastet; alles andere kann jederzeit
automatisch bearbeitet werden. Wer ein Issue schreibt, sollte deshalb hineinschreiben,
woran man erkennt, dass es fertig ist — das ist die Abnahmeliste des Autopiloten.

## Fallstricke

- **Gebaute Dateien nicht bearbeiten.** `index.html`, `Ukulele-Lehrbuch.html` und
  `quelle/body.html` werden von `bauen.py` überschrieben. Änderungen gehören in `quelle/`.
- **Nach jeder Änderung neu bauen und die Ergebnisse mitcommitten.** `index.html` ist die
  Seite, die GitHub Pages ausliefert — wird sie nicht mitcommittet, ändert sich für Leser
  nichts. Alle drei gebauten Dateien gehören in denselben Commit (so wie in `3280a47`).
- **`p6-songs-a.js` und `p7-songs-b.js` sind für sich genommen kaputt.** Die erste öffnet
  `<script>` und `var SONGS = [`, die zweite schließt beides. Einzeln lassen sie sich nicht
  syntaktisch prüfen, und die Reihenfolge in `TEILE` (`bauen.py`) darf nicht geändert
  werden. Neue Lieder immer *innerhalb* eines der beiden Blöcke einfügen.
- **Speicherschlüssel sind positionsabhängig.** Eingetragene Liedtexte liegen unter
  `uke.lyric.<song-id>.<abschnitt>.<zeile>`, Häkchen unter `uke.plan.<woche>.<index>`
  (`p8-render.js`). Wer eine `id` umbenennt oder Zeilen bzw. Plan-Aufgaben einfügt,
  umsortiert oder löscht, verschiebt damit die bereits gespeicherten Einträge aller
  Leser. Neues lieber hinten anhängen.
- **Keine urheberrechtlich geschützten Liedtexte einfügen.** Das ist Absicht: bei solchen
  Liedern steht `x:null`, damit ein Eingabefeld erscheint. Voller Text (`x:"…"`) nur bei
  gemeinfreien Stücken; die sind am Lied mit `pd:true` gekennzeichnet.
- **`python` gibt es auf diesem Server nicht, nur `python3`.** Ältere Anleitungen (auch
  `veroeffentlichen.ps1`) nennen `python` — das ist die Windows-Schreibweise.
- **Kein Framework, kein Build-Werkzeug, kein CDN.** Die Datei muss offline funktionieren.
  Keine externen Skripte, Schriften oder Bilder verlinken; SVG und Web Audio werden zur
  Laufzeit im Browser erzeugt.
- **Druck- und Dunkelansicht mitdenken.** `p1-style.html` enthält eigene Regeln für
  `@media print` und `[data-theme="dark"]`; neue Bausteine ohne diese Regeln fallen dort
  auf.
