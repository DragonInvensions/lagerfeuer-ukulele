# Veroeffentlicht das Ukulele-Lehrbuch auf GitHub Pages.
#
#   Einmalig vorher anmelden:   gh auth login
#   Dann:                       powershell -File quelle\veroeffentlichen.ps1
#
# Danach reicht fuer jede Aenderung:
#   python quelle\bauen.py ; git add -A ; git commit -m "..." ; git push

$ErrorActionPreference = "Stop"
$Owner = "DragonInvensions"
$Repo  = "lagerfeuer-ukulele"
$Slug  = "$Owner/$Repo"

Set-Location (Join-Path $PSScriptRoot "..")

# --- 1. Anmeldung pruefen -------------------------------------------------
gh auth status 2>&1 | Out-Null
if (-not $?) {
  Write-Host "Nicht bei GitHub angemeldet. Bitte zuerst ausfuehren:" -ForegroundColor Yellow
  Write-Host "    gh auth login" -ForegroundColor Yellow
  exit 1
}

$Aktiv = (gh api user --jq .login)
Write-Host "Angemeldet als: $Aktiv"
if ($Aktiv -ne $Owner) {
  Write-Host "ACHTUNG: aktiver Account ist '$Aktiv', erwartet wird '$Owner'." -ForegroundColor Red
  Write-Host "Umschalten mit:  gh auth switch --user $Owner" -ForegroundColor Yellow
  exit 1
}

# --- 2. Buch neu bauen ----------------------------------------------------
python quelle\bauen.py

# --- 3. Repo anlegen (falls noch nicht vorhanden) -------------------------
gh repo view $Slug 2>&1 | Out-Null
if (-not $?) {
  Write-Host "Lege Repository $Slug an ..."
  gh repo create $Slug --public --source . --remote origin --push `
    --description "Ukulele-Lehrbuch von null bis Lagerfeuer - 26 Lieder, Griffbilder, Schlagmuster, 8-Wochen-Plan"
} else {
  Write-Host "Repository $Slug existiert bereits."
  git remote get-url origin 2>&1 | Out-Null
  if (-not $?) { git remote add origin "https://github.com/$Slug.git" }
  git push -u origin main
}

# --- 4. GitHub Pages einschalten -----------------------------------------
Write-Host "Schalte GitHub Pages ein ..."
gh api -X POST "repos/$Slug/pages" -f "source[branch]=main" -f "source[path]=/" 2>&1 | Out-Null
if (-not $?) {
  # Bereits aktiv -> nur die Quelle aktualisieren
  gh api -X PUT "repos/$Slug/pages" -f "source[branch]=main" -f "source[path]=/" 2>&1 | Out-Null
}

# --- 5. Themen und Fertigmeldung -----------------------------------------
gh repo edit $Slug --add-topic ukulele --add-topic songbook --add-topic music-education `
  --add-topic lagerfeuer --add-topic chords 2>&1 | Out-Null

$Url = "https://$($Owner.ToLower()).github.io/$Repo/"
Write-Host ""
Write-Host "Fertig. Die Seite ist in ein bis zwei Minuten erreichbar unter:" -ForegroundColor Green
Write-Host "    $Url" -ForegroundColor Green
Write-Host "Repository: https://github.com/$Slug"
