#!/usr/bin/env python3
"""Baut aus den Teildateien in diesem Ordner das fertige Lehrbuch.

    python bauen.py

Ergebnis: ..\\Ukulele-Lehrbuch.html   (die Datei, die der Nutzer lokal oeffnet)
          ..\\index.html             (identisch — Einstiegsseite fuer GitHub Pages)
          .\\body.html                (Rumpf ohne <html>/<head> — fuer Artifact-Publish)

Reihenfolge ist wichtig:
  p1  Styles
  p2  Kopf, Inhaltsverzeichnis, Hero, Kapitel 1-3
  p3  Kapitel 4-8 + Akkord-Lexikon
  p4  Liederteil-Rahmen, 8-Wochen-Plan, Werkzeugkasten, Footer
  p5  Kernskript: Akkorddatenbank, Griffbild-SVG, Transponieren, Audio, Muster
  p6  Lieder Teil A   (oeffnet <script> und das SONGS-Array)
  p7  Lieder Teil B   (schliesst SONGS-Array und </script>)
  p8  Renderskript: Lieder, Plan, Filter
"""
import pathlib

TEILE = ["p1-style.html", "p2-shell.html", "p3-chapters.html", "p4-tail.html",
         "p5-core.js", "p6-songs-a.js", "p7-songs-b.js", "p8-render.js"]

KOPF = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Lagerfeuer-Ukulele</title>
<meta name="description" content="Ukulele-Lehrbuch von null bis Lagerfeuer: 37 Lieder, Griffbilder, Schlagmuster und 8-Wochen-Plan.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="icon-32.png">
<link rel="apple-touch-icon" href="icon-180.png">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F6F8F5">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0D1614">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Ukulele">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
</head>
<body>
"""
FUSS = "\n</body>\n</html>\n"

hier = pathlib.Path(__file__).resolve().parent
rumpf = "".join((hier / t).read_text(encoding="utf-8") for t in TEILE)

(hier / "body.html").write_text(rumpf, encoding="utf-8")

seite = KOPF + rumpf + FUSS
ziel = hier.parent / "Ukulele-Lehrbuch.html"
pages = hier.parent / "index.html"
ziel.write_text(seite, encoding="utf-8")
pages.write_text(seite, encoding="utf-8")

print(f"Gebaut: {ziel}  ({ziel.stat().st_size // 1024} KB)")
print(f"Pages:  {pages}")
print(f"Rumpf:  {hier / 'body.html'}")
