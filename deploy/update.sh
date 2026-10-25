#!/usr/bin/env bash
# Holt den Zweig aus UKULELE_ZWEIG und startet den Dienst neu, wenn sich etwas geaendert hat.
# Aufgerufen vom Timer ukulele-update.timer – ausrollen heisst damit: in diesen Zweig mergen.
set -euo pipefail

REPO="$HOME/projects/lagerfeuer-ukulele"
ZWEIG="${UKULELE_ZWEIG:-main}"
cd "$REPO"

VORHER=$(git rev-parse HEAD)
git fetch --quiet origin "$ZWEIG"
git reset --hard --quiet "origin/$ZWEIG"
NACHHER=$(git rev-parse HEAD)
[ "$VORHER" = "$NACHHER" ] && exit 0

echo "[$(date '+%F %T')] Neuer Stand auf $ZWEIG: ${VORHER:0:7} -> ${NACHHER:0:7}"
git --no-pager log --oneline "${VORHER}..${NACHHER}" | sed 's/^/    /'
systemctl --user restart ukulele.service
echo "[$(date '+%F %T')] Dienst neu gestartet."
