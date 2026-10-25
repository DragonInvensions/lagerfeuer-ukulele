"""Liest QR-Codes zurueck, die app/kern/qr.js erzeugt hat – Gegenprobe mit einem fremden Leser (OpenCV).
Braucht opencv-python (nur hier, nicht fuer die App). Aufruf: python -I werkzeug/qr-pruefen.py <bild.png> [<bild.png> ...]   gibt je Bild den gelesenen Text aus."""
import sys

import cv2

# Windows-Konsolen schreiben sonst in cp1252, Umlaute im gelesenen Text kaemen falsch an
sys.stdout.reconfigure(encoding="utf-8")
leser = cv2.QRCodeDetector()
for pfad in sys.argv[1:]:
    bild = cv2.imread(pfad)
    text, _, _ = leser.detectAndDecode(bild)
    print(f"{pfad}\t{text}")
