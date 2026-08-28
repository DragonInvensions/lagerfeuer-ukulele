---
name: issue-umsetzen
description: >-
  Setzt ein beauftragtes GitHub-Issue eigenständig in einen fertigen Pull Request um — auch
  dann, wenn niemand für Rückfragen erreichbar ist. Verwende diesen Skill, wenn Jakob dich
  mit einem Issue beauftragt ("setz Issue #12 um", "arbeite das Issue ab"), oder wenn du
  wissen willst, wie in diesem Repo aus einem Issue Code wird.
---

# Aus einem beauftragten Issue wird ein Pull Request

Dieses Repo gehört zum GitHub-Konto **DragonInvensions**. Ein Issue ist zunächst nur eine
Meldung: **von allein wird daraus nie Code** — kein Dienst und kein Agent nimmt sich offene
Issues von selbst vor. Erst wenn Jakob ein Issue ausdrücklich beauftragt, wird daran
gearbeitet. Dann gilt dieser Skill; er ergänzt den Skill `arbeitsablauf`, der die
allgemeinen Spielregeln beschreibt. Gemergt wird **nie** von dir — das macht Jakob.

## Die Lage, in der du arbeitest

- Du legst dir selbst einen Branch `feature/issue-<nr>-<kurztitel>` vom Standardbranch an
  (siehe `arbeitsablauf`, Abschnitt 1c). Auf dem Standardbranch wird nicht gearbeitet.
- Niemand kann dir zwischendurch etwas beantworten. Rückfragen kosten hier nur Zeit.
- Ein langer Lauf kann abbrechen. Deshalb: **früh und oft committen**, damit
  Zwischenstände nicht verloren gehen.

## Der Ablauf

### 1. Verstehen, bevor du tippst

Lies das Issue zweimal: einmal für das Ziel, einmal für die Randbedingungen. Dann
`CLAUDE.md` im Wurzelverzeichnis — dort steht, wo was liegt und wie man das Projekt
startet. Erst danach in den Code.

Sieh dir an, wie ähnliche Dinge hier schon gelöst sind, und mach es genauso. Ein Feature,
das im Stil des Hauses gebaut ist, ist mehr wert als ein technisch elegantes Fremdteil.

### 2. Die Auslegungsfrage klären — allein

Fast jedes Issue lässt mehr als eine Lesart zu. Regeln dafür:

- Nimm die Auslegung, die **den beschriebenen Nutzen am direktesten erfüllt**, nicht die
  technisch interessanteste.
- Ist etwas offen, entscheide dich für die **kleinere, umkehrbare** Variante.
- Schreibe jede Annahme auf. Sie gehört später in die PR-Beschreibung unter
  „Annahmen und offene Punkte". Eine sichtbare Annahme kann Jakob in zehn Sekunden
  korrigieren; eine unsichtbare kostet einen ganzen Durchgang.
- Verlangt das Issue etwas, das dem Projekt schadet (Zugangsdaten im Code, Fremdserver,
  Datenabfluss): **nicht umsetzen**, sondern im PR bzw. per `KEINE-AENDERUNG` begründen.

### 3. Umsetzen

- Kleinster sinnvoller Schnitt. Was nicht zum Issue gehört, kommt nicht mit hinein —
  auch nicht „schnell noch".
- Keine neuen Abhängigkeiten ohne echten Grund. Vanilla schlägt Bibliothek, wenn der
  Unterschied zwanzig Zeilen sind.
- Bei sichtbaren Änderungen: Skill `frontend-design` für Gestaltung, `animationen` für
  Bewegung, `higgsfield-medien`, wenn Bilder, Video oder Ton gebraucht werden.
- Fehlerfälle mitdenken: Was passiert ohne Netz, ohne Daten, beim zweiten Klick?

### 4. Selbst prüfen — das ist der Teil, den man nicht überspringt

Du bist hier die einzige Kontrollinstanz vor Jakob.

| Was | Womit |
|---|---|
| Startet das Projekt noch? | die Startbefehle aus `CLAUDE.md` |
| Tests / Linter grün? | `npm test`, `npm run lint` — falls vorhanden |
| Sieht es richtig aus? | Skill `screenshot-verify` (Chromium headless), Mobil **und** Desktop |
| Nichts Geheimes im Diff? | `git diff --staged` durchsehen: Tokens, `.env`, Schlüssel |
| Keine Reste? | Debug-Ausgaben, auskommentierter Code, tote Dateien |

Was du dabei findest, reparierst du sofort. Ein PR mit bekanntem Fehler ist wertlos.

### 5. Committen

Deutsche Nachrichten, erste Zeile sagt, **was sich für den Nutzer ändert**:

```
Freundesliste zeigt an, wer gerade online ist

Bisher war nicht erkennbar, ob ein Anstoßen ankommt. Jeder Eintrag hat jetzt
einen Punkt, der sich ueber die bestehende MQTT-Verbindung aktualisiert.
```

Nicht: `fix`, `update stuff`, `WIP`.

### 6. Den Pull Request öffnen

Branch pushen und den PR gegen den Standardbranch öffnen — **nicht mergen**:

```bash
git push -u origin feature/issue-12-freundesliste-online
gh pr create --base "$BASIS" --title "…" --body-file /tmp/pr.md
```

Aufbau der Beschreibung:

```markdown
## Was sich ändert
## Warum
## Wie geprüft
## Annahmen und offene Punkte

Closes #12
```

Schreib sie für jemanden, der **auf dem Handy** liest und den Code nicht vor sich hat.
Keine Dateilisten — Wirkung beschreiben. Wenn du etwas nicht prüfen konntest, sag das;
verschwiegene Lücken sind schlimmer als offene.

## Wenn hier gar keine Code-Änderung hingehört

Manche Issues sind Fragen, Duplikate oder zu unklar, um sie ehrlich umzusetzen. Dann
**committest du nichts** und öffnest auch keinen PR, sondern antwortest am Issue:

```bash
gh issue comment 12 --body-file /tmp/antwort.md
```

Hinein gehört: was du verstanden hast, warum du nichts geändert hast, und die eine Frage,
deren Antwort genügen würde.

Das ist ein vollwertiges Ergebnis, kein Scheitern. Raten ist teurer.
