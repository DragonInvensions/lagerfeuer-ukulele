#!/usr/bin/env bash
# Setzt Jakobs Passwort auf Jarvis. Fragt verdeckt zweimal nach; das Passwort steht danach
# nirgends im Klartext, nur als scrypt-Hash in $UKULELE_DATEN/zugang.json.
#   ssh -t sekretaer-claude 'bash ~/projects/lagerfeuer-ukulele/deploy/passwort-setzen.sh'
set -euo pipefail
set -a; . "$HOME/.config/ukulele/ukulele.env"; set +a

read -rsp "Neues Passwort (mindestens 10 Zeichen): " ERSTES; echo
read -rsp "Noch einmal: " ZWEITES; echo
if [ "$ERSTES" != "$ZWEITES" ]; then
  echo "Die beiden Eingaben sind verschieden. Nichts geändert." >&2
  exit 1
fi
printf '%s' "$ERSTES" | node "$HOME/projects/lagerfeuer-ukulele/werkzeug/passwort-setzen.js"
