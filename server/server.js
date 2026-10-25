/* Server der Lagerfeuer-Ukulele: liefert die App und die oeffentlichen Lieder aus.
   Spaeter kommen hier Anmeldung, private Lieder und das Mitsingen per QR-Code dazu.
   Start: node server/server.js   (Port ueber UKULELE_PORT, Standard 4810) */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORDNER = { "/": path.join(WURZEL, "app"), "/lieder/": path.join(WURZEL, "lieder") };
const PORT = Number(process.env.UKULELE_PORT ?? 4810);
const ARTEN = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".webmanifest": "application/manifest+json", ".woff2": "font/woff2",
};

/* Nur Dateien innerhalb des freigegebenen Ordners, nie per ../ daraus heraus. */
export function dateiFuer(adresse) {
  const pfad = decodeURIComponent(new URL(adresse, "http://x").pathname);
  const praefix = pfad.startsWith("/lieder/") ? "/lieder/" : "/";
  const ordner = ORDNER[praefix];
  const ziel = path.resolve(ordner, "." + path.sep + pfad.slice(praefix.length));
  if (ziel !== ordner && !ziel.startsWith(ordner + path.sep)) return null;
  return pfad.endsWith("/") ? path.join(ziel, "index.html") : ziel;
}

export async function liederUebersicht() {
  const dateien = (await fs.readdir(ORDNER["/lieder/"])).filter((datei) => datei.endsWith(".json"));
  const lieder = await Promise.all(dateien.map(async (datei) => {
    const lied = JSON.parse(await fs.readFile(path.join(ORDNER["/lieder/"], datei), "utf8"));
    return { id: lied.id, titel: lied.titel, untertitel: lied.untertitel, stufe: lied.stufe, tonart: lied.tonart,
      gemeinfrei: lied.gemeinfrei, stern: Boolean(lied.stern), mitText: lied.silben.length > 0 };
  }));
  return lieder.sort((a, b) => a.stufe - b.stufe || a.titel.localeCompare(b.titel, "de"));
}

async function antworten(anfrage, antwort) {
  if (anfrage.method !== "GET" && anfrage.method !== "HEAD") return senden(antwort, 405, "text/plain", "Nur GET");
  if (anfrage.url === "/api/lieder") return senden(antwort, 200, ARTEN[".json"], JSON.stringify(await liederUebersicht()));
  const datei = dateiFuer(anfrage.url);
  if (!datei) return senden(antwort, 403, "text/plain", "Verboten");
  try {
    const inhalt = await fs.readFile(datei);
    return senden(antwort, 200, ARTEN[path.extname(datei)] ?? "application/octet-stream", inhalt);
  } catch (fehler) {
    if (fehler.code === "ENOENT" || fehler.code === "EISDIR") return senden(antwort, 404, "text/plain", "Nicht gefunden");
    throw fehler;
  }
}

function senden(antwort, status, art, inhalt) {
  antwort.writeHead(status, { "Content-Type": art, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" });
  antwort.end(inhalt);
}

export function serverStarten(port = PORT) {
  const server = http.createServer((anfrage, antwort) => {
    antworten(anfrage, antwort).catch((fehler) => {
      console.error(fehler);
      if (!antwort.headersSent) senden(antwort, 500, "text/plain", "Fehler im Server");
    });
  });
  return new Promise((fertig) => server.listen(port, "127.0.0.1", () => fertig(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  serverStarten().then(() => console.log(`Lagerfeuer-Ukulele laeuft auf http://127.0.0.1:${PORT}/`));
}
