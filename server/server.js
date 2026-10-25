/* Server der Lagerfeuer-Ukulele: liefert App und oeffentliche Lieder aus und – nur nach Anmeldung –
   die privaten Liedtexte. Anmeldung: Jakobs Passwort oder ein Einmal-Link (siehe zugang.js).

   Start: node server/server.js
   Umgebung: UKULELE_PORT (4810), UKULELE_DATEN (Ordner fuer Zugang und Texte, nie im Repo),
             UKULELE_HINTER_PROXY=1 hinter Caddy (dann zaehlt X-Forwarded-For und der Cookie ist Secure). */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zugangAnlegen, ROLLEN } from "./zugang.js";
import { texteAblage, textspurPruefen } from "./texte.js";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORDNER = { "/": path.join(WURZEL, "app"), "/lieder/": path.join(WURZEL, "lieder") };
const ARTEN = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".webmanifest": "application/manifest+json", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};
const KOERPER_GRENZE = 512 * 1024;

/* Nur Dateien innerhalb des freigegebenen Ordners, nie per ../ daraus heraus. */
export function dateiFuer(adresse) {
  const pfad = decodeURIComponent(new URL(adresse, "http://x").pathname);
  const praefix = pfad.startsWith("/lieder/") ? "/lieder/" : "/";
  const ordner = ORDNER[praefix];
  const ziel = path.resolve(ordner, "." + path.sep + pfad.slice(praefix.length));
  if (ziel !== ordner && !ziel.startsWith(ordner + path.sep)) return null;
  return pfad.endsWith("/") ? path.join(ziel, "index.html") : ziel;
}

async function oeffentlichesLied(id) {
  return JSON.parse(await fs.readFile(path.join(ORDNER["/lieder/"], `${id}.json`), "utf8"));
}

async function liederUebersicht(mitPrivatemText) {
  const dateien = (await fs.readdir(ORDNER["/lieder/"])).filter((datei) => datei.endsWith(".json"));
  const lieder = await Promise.all(dateien.map(async (datei) => {
    const lied = await oeffentlichesLied(datei.slice(0, -5));
    return { id: lied.id, titel: lied.titel, untertitel: lied.untertitel, stufe: lied.stufe, tonart: lied.tonart,
      gemeinfrei: lied.gemeinfrei, stern: Boolean(lied.stern), mitText: lied.silben.length > 0 || mitPrivatemText.has(lied.id) };
  }));
  return lieder.sort((a, b) => a.stufe - b.stufe || a.titel.localeCompare(b.titel, "de"));
}

/* Einfache Bremse gegen Durchprobieren von Passwoertern: 10 Versuche je 15 Minuten und Absender */
function bremseAnlegen() {
  const versuche = new Map();
  return {
    zuViele(absender) {
      const jetzt = Date.now(), eintrag = versuche.get(absender);
      if (!eintrag || jetzt - eintrag.start > 15 * 60 * 1000) { versuche.set(absender, { start: jetzt, n: 1 }); return false; }
      eintrag.n += 1;
      return eintrag.n > 10;
    },
    zuruecksetzen: (absender) => versuche.delete(absender),
  };
}

export function serverStarten({
  port = Number(process.env.UKULELE_PORT ?? 4810),
  daten = process.env.UKULELE_DATEN ?? path.join(WURZEL, ".daten"),
  hinterProxy = process.env.UKULELE_HINTER_PROXY === "1",
} = {}) {
  const zugang = zugangAnlegen(daten);
  const texte = texteAblage(daten);
  const bremse = bremseAnlegen();
  const absender = (anfrage) => (hinterProxy ? String(anfrage.headers["x-forwarded-for"] ?? "").split(",")[0].trim() : "") || anfrage.socket.remoteAddress;

  function senden(antwort, status, art, inhalt, zusatz = {}) {
    antwort.writeHead(status, { "Content-Type": art, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin", ...zusatz });
    antwort.end(inhalt);
  }
  const json = (antwort, status, wert, zusatz) => senden(antwort, status, ARTEN[".json"], JSON.stringify(wert), zusatz);

  async function koerper(anfrage) {
    if (!String(anfrage.headers["content-type"] ?? "").startsWith("application/json")) throw Object.assign(new Error("JSON erwartet"), { status: 415 });
    let groesse = 0;
    const stuecke = [];
    for await (const stueck of anfrage) {
      groesse += stueck.length;
      if (groesse > KOERPER_GRENZE) throw Object.assign(new Error("Anfrage zu groß"), { status: 413 });
      stuecke.push(stueck);
    }
    try {
      return JSON.parse(Buffer.concat(stuecke).toString("utf8"));
    } catch {
      throw Object.assign(new Error("kein gültiges JSON"), { status: 400 });
    }
  }

  /* Schreibende Anfragen nur von der eigenen Seite (gegen untergeschobene Formulare) */
  function eigeneHerkunft(anfrage) {
    const herkunft = anfrage.headers.origin;
    if (!herkunft) return true;
    try { return new URL(herkunft).host === anfrage.headers.host; } catch { return false; }
  }

  async function api(anfrage, antwort, pfad) {
    const rolle = zugang.rolleAus(anfrage.headers.cookie);
    const schreibend = anfrage.method !== "GET" && anfrage.method !== "HEAD";
    if (schreibend && !eigeneHerkunft(anfrage)) return json(antwort, 403, { fehler: "fremde Herkunft" });

    if (pfad === "/api/ich" && anfrage.method === "GET") return json(antwort, 200, { rolle });

    if (pfad === "/api/lieder" && anfrage.method === "GET") {
      return json(antwort, 200, await liederUebersicht(new Set(rolle ? await texte.vorhandene() : [])));
    }

    if (pfad === "/api/anmelden" && anfrage.method === "POST") {
      const wer = absender(anfrage);
      if (bremse.zuViele(wer)) return json(antwort, 429, { fehler: "Zu viele Versuche. Bitte in 15 Minuten noch einmal." });
      const { passwort } = await koerper(anfrage);
      if (!zugang.passwortPruefen(passwort ?? "")) return json(antwort, 401, { fehler: "Das Passwort stimmt nicht." });
      bremse.zuruecksetzen(wer);
      return json(antwort, 200, { rolle: ROLLEN.verwalter }, { "Set-Cookie": zugang.cookieFuer(ROLLEN.verwalter, hinterProxy) });
    }

    if (pfad === "/api/abmelden" && anfrage.method === "POST") {
      return json(antwort, 200, { rolle: null }, { "Set-Cookie": zugang.cookieLoeschen() });
    }

    if (pfad === "/api/einmal-link" && anfrage.method === "POST") {
      if (rolle !== ROLLEN.verwalter) return json(antwort, 403, { fehler: "Nur mit Passwort angemeldet." });
      const { name } = await koerper(anfrage);
      return json(antwort, 200, { pfad: `/einmal/${zugang.einmalLinkAnlegen(name)}` });
    }

    const textAdresse = /^\/api\/texte\/([a-z0-9-]+)$/.exec(pfad);
    if (textAdresse) {
      const id = textAdresse[1];
      if (!rolle) return json(antwort, 401, { fehler: "Bitte anmelden." });
      if (anfrage.method === "GET") {
        const spur = await texte.lesen(id);
        return spur ? json(antwort, 200, spur) : json(antwort, 404, { fehler: "Für dieses Lied gibt es noch keinen Text." });
      }
      if (anfrage.method === "PUT") {
        if (rolle !== ROLLEN.verwalter) return json(antwort, 403, { fehler: "Gäste dürfen Texte nur lesen." });
        let lied;
        try { lied = await oeffentlichesLied(id); } catch { return json(antwort, 404, { fehler: "Dieses Lied gibt es nicht." }); }
        if (lied.gemeinfrei) return json(antwort, 400, { fehler: "Gemeinfreie Lieder haben ihren Text schon im Lied." });
        const spur = await koerper(anfrage);
        const fehler = textspurPruefen(lied, spur);
        if (fehler.length) return json(antwort, 400, { fehler: fehler[0], alle: fehler });
        await texte.schreiben(id, spur);
        return json(antwort, 200, { gespeichert: id });
      }
    }
    return json(antwort, 404, { fehler: "Unbekannte Adresse" });
  }

  async function antworten(anfrage, antwort) {
    const pfad = new URL(anfrage.url, "http://x").pathname;
    if (pfad.startsWith("/api/")) return api(anfrage, antwort, pfad);

    /* Einmal-Link: einloesen, Geraet als Gast anmelden, weiter zur Liederliste */
    const einmal = /^\/einmal\/([A-Za-z0-9_-]{10,64})$/.exec(pfad);
    if (einmal && anfrage.method === "GET") {
      const ergebnis = zugang.einmalLinkEinloesen(einmal[1]);
      if (ergebnis.fehler) return senden(antwort, 303, "text/plain", "", { Location: `/#/anmelden?link=${ergebnis.fehler}` });
      return senden(antwort, 303, "text/plain", "", { Location: "/#/", "Set-Cookie": zugang.cookieFuer(ergebnis.rolle, hinterProxy) });
    }

    if (anfrage.method !== "GET" && anfrage.method !== "HEAD") return senden(antwort, 405, "text/plain", "Nur GET");
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

  const server = http.createServer((anfrage, antwort) => {
    antworten(anfrage, antwort).catch((fehler) => {
      if (fehler.status) return json(antwort, fehler.status, { fehler: fehler.message });
      console.error(fehler);
      if (!antwort.headersSent) senden(antwort, 500, "text/plain", "Fehler im Server");
    });
  });
  return new Promise((fertig) => server.listen(port, "127.0.0.1", () => fertig(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  serverStarten().then((server) => console.log(`Lagerfeuer-Ukulele laeuft auf http://127.0.0.1:${server.address().port}/`));
}
