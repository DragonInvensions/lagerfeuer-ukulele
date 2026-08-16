# Veroeffentlicht das Ukulele-Lehrbuch auf GitHub Pages.
#
#   1. Einmalig anmelden:  gh auth login
#   2. Dieses Skript:      powershell -ExecutionPolicy Bypass -File quelle\veroeffentlichen.ps1
#
# Danach reicht fuer jede weitere Aenderung:
#   python quelle\bauen.py ; git add -A ; git commit -m "..." ; git push

$Owner = "DragonInvensions"
$Repo  = "lagerfeuer-ukulele"
$Slug  = "$Owner/$Repo"

Set-Location (Join-Path $PSScriptRoot "..")

function Fehler($text) { Write-Host "" ; Write-Host $text -ForegroundColor Red ; exit 1 }
function Schritt($text) { Write-Host "" ; Write-Host "==> $text" -ForegroundColor Cyan }

# --- 1. Ist gh da? --------------------------------------------------------
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Fehler @"
Die GitHub-CLI (gh) ist nicht installiert.
Installieren mit:   winget install GitHub.cli
Danach dieses Fenster neu oeffnen und das Skript erneut starten.
"@
}

# --- 2. Angemeldet? -------------------------------------------------------
Schritt "Pruefe Anmeldung"
$null = gh auth status
if ($LASTEXITCODE -ne 0) {
  Fehler @"
Nicht bei GitHub angemeldet. Bitte zuerst ausfuehren:

    gh auth login

Im Dialog waehlen:  GitHub.com  ->  HTTPS  ->  Yes (Git-Zugangsdaten)
 ->  Login with a web browser.  Dort mit dem Konto $Owner anmelden.
Danach dieses Skript erneut starten.
"@
}

$Aktiv = (gh api user --jq .login)
if ($LASTEXITCODE -ne 0) { Fehler "Konnte den angemeldeten Benutzer nicht abfragen." }
Write-Host "    Angemeldet als: $Aktiv"

if ($Aktiv -ne $Owner) {
  Fehler @"
Aktiver Account ist '$Aktiv', erwartet wird '$Owner'.

Umschalten mit:     gh auth switch --user $Owner
Oder neu anmelden:  gh auth login
"@
}

# --- 3. Buch neu bauen ----------------------------------------------------
Schritt "Baue das Buch neu"
python quelle\bauen.py
if ($LASTEXITCODE -ne 0) { Fehler "bauen.py ist fehlgeschlagen." }

# --- 4. Aenderungen sichern ----------------------------------------------
$offen = git status --porcelain
if ($offen) {
  Schritt "Committe offene Aenderungen"
  git add -A
  git commit -m "Buch neu gebaut"
}

# --- 5. Repository anlegen oder aktualisieren -----------------------------
$null = gh repo view $Slug
if ($LASTEXITCODE -ne 0) {
  Schritt "Lege Repository $Slug an und pushe"
  gh repo create $Slug --public --source . --remote origin --push --description "Ukulele-Lehrbuch von null bis Lagerfeuer - 26 Lieder, Griffbilder, Schlagmuster, 8-Wochen-Plan"
  if ($LASTEXITCODE -ne 0) { Fehler "Repository konnte nicht angelegt werden." }
} else {
  Schritt "Repository $Slug existiert schon - pushe nur"
  $null = git remote get-url origin
  if ($LASTEXITCODE -ne 0) { git remote add origin "https://github.com/$Slug.git" }
  git push -u origin main
  if ($LASTEXITCODE -ne 0) { Fehler "Push fehlgeschlagen." }
}

# --- 6. GitHub Pages einschalten -----------------------------------------
Schritt "Schalte GitHub Pages ein (Branch main, Ordner /)"
$null = gh api -X POST "repos/$Slug/pages" -f "source[branch]=main" -f "source[path]=/"
if ($LASTEXITCODE -ne 0) {
  # Vermutlich schon aktiv -> Quelle nur aktualisieren
  $null = gh api -X PUT "repos/$Slug/pages" -f "source[branch]=main" -f "source[path]=/"
}

# --- 7. Kosmetik ----------------------------------------------------------
$null = gh repo edit $Slug --add-topic ukulele --add-topic songbook --add-topic music-education --add-topic chords --add-topic german

# --- 8. Fertig ------------------------------------------------------------
$Url = "https://$($Owner.ToLower()).github.io/$Repo/"
Write-Host ""
Write-Host "Fertig." -ForegroundColor Green
Write-Host "Seite (in 1-2 Minuten erreichbar):  $Url" -ForegroundColor Green
Write-Host "Repository:                         https://github.com/$Slug"
Write-Host ""
Write-Host "Tipp: Seite am Handy oeffnen und zum Startbildschirm hinzufuegen."
