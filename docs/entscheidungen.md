# Entscheidungen

Große, langfristige Entscheidungen für die Lagerfeuer-Ukulele: Datum, was, warum und was verworfen wurde.
Hintergrund steht in [`konzept-mitspielen.md`](konzept-mitspielen.md).

---

## 24.10.2026 – Neuaufbau der ganzen App, alte Fassung im Branch `old`

**Entscheidung:** Die App wird komplett neu aufgesetzt, mit überarbeitetem Aussehen. Die alte Fassung (Stand `0614bfd`) bleibt im
Branch `old` erhalten. Gebaut wird auf `feature/neuaufbau`, nach `main` kommt es per PR, den Jakob mergt.
**Warum:** Jakobs Wahl (U2), ausdrücklich auch, um Look und Feel zu modernisieren. `main` speist GitHub Pages. Solange der PR
offen ist, läuft dort weiter die alte App.
**Verworfen:** nur den Liederteil neu bauen (U1). Das wäre der kleinere Eingriff gewesen, hätte das Aussehen aber nicht erneuert.

## 24.10.2026 – Liedformat „Liedspur“ in Takt-Zeit

**Entscheidung:** Jedes Lied ist eine JSON-Datei `lieder/<id>.json` im Format `liedspur/1`. Alle Positionen werden in Vierteln ab
der Eins von Takt 1 gezählt (Auftakt negativ), das Tempo steht in einer Tempokarte. Akkorde werden nur als Wechsel gespeichert.
Ableitbares (Akkorddauer, Taktstriche, Griffliste) wird nie gespeichert. Die Übernahme aus `quelle/p6`+`p7` läuft einmalig; danach
sind die JSON-Dateien die einzige Wahrheit.
**Warum:** Am Lagerfeuer gibt es keine Aufnahme, und beim Üben muss das Tempo frei sein. Akkordwechsel fallen auf Schläge.
UltraStar rechnet genauso, lässt sich also einlesen.
**Verworfen:** Zeiten in Sekunden (bindet jedes Lied an eine Aufnahme); UltraStar als eigenes Format (keine Akkorde, keine
Tempokarte); ChordPro (keine Zeit).

## 24.10.2026 – Silben-Rhythmus der Volkslieder aus vorhandenen Noten

**Entscheidung:** Für gemeinfreie Lieder wird der Rhythmus aus den Notensätzen der deutschen Wikipedia bzw. des Wikibooks-Liederbuchs
übertragen (Status `aus-noten`, Quelle im Lied vermerkt). Der Tipp-Editor (K3) wird vorerst nicht gebaut.
**Warum:** Jakobs Frage „Gibt es die Daten nicht schon?“ Für mindestens 14 der 23 Volkslieder: ja, als LilyPond-Satz mit
untergelegtem Text. Die Melodien sind gemeinfrei, die Notensätze stehen unter CC BY-SA und werden deshalb im Lied genannt.
**Verworfen:** alles von Hand antippen; einen LilyPond-Leser bauen (für 23 Lieder zu viel Code, weil Bindebögen, Wiederholungen und
Strophen die Silbenzuordnung verschieben). Übertragen wird von Hand und mit der Prüfung `pruefen()` im Kern abgesichert.

## 24.10.2026 – Technik: Web-App ohne Framework, Tests mit Node

**Entscheidung:** Die App besteht aus ES-Modulen und CSS, ohne Framework und ohne Bundler. Sie ist eine PWA mit Service Worker, damit
sie am Feuer offline läuft. Die Logik steht in `app/kern/` und ist frei von DOM. Getestet wird mit `node --test`, ohne Fremdpaket.
GitHub Actions führt die Tests bei jedem Push und PR aus.
**Warum:** Die alte App kam ohne Abhängigkeiten aus, und das soll so bleiben. Ein Framework brächte für eine Seite mit drei
Spuren nur Aktualisierungsarbeit mit.
**Verworfen:** React/Vite (Bauschritt und Abhängigkeiten); weiter eine einzige zusammengesetzte HTML-Datei per `bauen.py` (auf
Jarvis gibt es einen echten Server, Doppelklick-Fähigkeit ist nicht mehr nötig).

## 24.10.2026 – Geschützte Lieder auf Jarvis hinter einer Anmeldung, Ton über YouTube

**Entscheidung:** Liedspuren mit geschütztem Text liegen nur auf Jarvis (Datenordner außerhalb des Repos) und werden nur nach
Anmeldung ausgeliefert. Im öffentlichen Repo stehen nur App-Code und gemeinfreie Lieder. Ein Test bricht ab, sobald dort ein Lied
mit `"gemeinfrei": false` Text enthält. Mitgespielt wird zum eingebetteten offiziellen YouTube-Video (IFrame-API).
**Warum:** Jakobs Wahl (P2, A2). Alle Geräte sehen sofort dieselben Lieder, ohne Kauf und ohne Download.
**Verworfen:** Liedpakete per Datei-Import (P1); eigene Musikdatei (A1) oder beides (A3).
**Offen:** Anmeldeweg (Anmeldedienst mit Google oder eigenes Passwort), Adresse auf Jarvis, ob GitHub Pages danach abgeschaltet
wird.

## 25.10.2026 – Audio für die Auswertung am PC per yt-dlp von YouTube

**Entscheidung:** Die Pipeline (B4) lädt das Audio des offiziellen Videos per `yt-dlp` herunter, nur zur Auswertung auf dem PC.
Die Datei bleibt lokal und wird weder gespeichert noch ausgeliefert. Mitgespielt wird weiter zum eingebetteten Video.
**Warum:** Jakobs Wahl. Kostenlos und ohne Kauf je Lied. Ihm ist bekannt, dass das gegen YouTubes Nutzungsbedingungen verstößt.
**Verworfen:** das Lied je ~1 € kaufen; die Pipeline weglassen.

## 25.10.2026 – Zielgruppe und Gestaltungsweg

**Entscheidung:** Die App ist für Jakob und seine Mitsänger, nicht für Fremde (kein Einstieg für Neue). Hauptlage ist das Handy
am Lagerfeuer. Gestaltet wird mit dem Skill `impeccable`, direkt als Code (`.impeccable/config.json`). Produktwahrheit steht in
`PRODUCT.md`.
