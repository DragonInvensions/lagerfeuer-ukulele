import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { dateiFuer, serverStarten } from "../server/server.js";
import { zugangAnlegen } from "../server/zugang.js";
import { textAufZeilen } from "../app/kern/textspur.js";

const PASSWORT = "lagerfeuer-am-see";

async function testServer() {
  const daten = fs.mkdtempSync(path.join(os.tmpdir(), "ukulele-server-"));
  zugangAnlegen(daten, undefined).passwortSetzen(PASSWORT);
  const server = await serverStarten({ port: 0, daten, hinterProxy: false });
  const adresse = `http://127.0.0.1:${server.address().port}`;
  const holen = (pfad, { cookie, ...optionen } = {}) => fetch(`${adresse}${pfad}`, { redirect: "manual", ...optionen,
    headers: { ...(optionen.body ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}), ...optionen.headers } });
  return { server, daten, holen };
}
const cookieAus = (antwort) => antwort.headers.get("set-cookie").split(";")[0];

test("Pfade bleiben in ihrem Ordner", () => {
  assert.match(dateiFuer("/"), /app[\\/]index\.html$/);
  assert.match(dateiFuer("/lieder/entchen.json"), /lieder[\\/]entchen\.json$/);
  assert.equal(dateiFuer("/../package.json"), dateiFuer("/package.json"), "../ am Anfang wird von URL aufgeloest");
  assert.equal(dateiFuer("/lieder/..%2F..%2Fpackage.json"), null, "kodierte Schraegstriche duerfen nicht hinaus");
  assert.match(dateiFuer("/%2E%2E/%2E%2E/package.json"), /app[\\/]package\.json$/, "kodierte Punkte loest URL auf, es bleibt in app/");
});

test("Liederliste, ein Lied und die Schrift kommen aus dem Server", async () => {
  const { server, holen } = await testServer();
  try {
    const liste = await (await holen("/api/lieder")).json();
    assert.ok(liste.length >= 42);
    assert.ok(liste.every((lied) => lied.id && lied.titel && typeof lied.mitText === "boolean"));
    assert.equal((await (await holen("/lieder/entchen.json")).json()).id, "entchen");
    assert.equal((await holen("/gibtsnicht.js")).status, 404);
    const schrift = await holen("/schrift/archivo.woff2");
    assert.equal(schrift.headers.get("content-type"), "font/woff2");
  } finally {
    server.close();
  }
});

test("Private Texte: nur angemeldet lesen, nur mit Passwort schreiben", async () => {
  const { server, holen } = await testServer();
  try {
    assert.equal((await holen("/api/texte/hosezerrissen")).status, 401);
    assert.equal((await holen("/api/anmelden", { method: "POST", body: JSON.stringify({ passwort: "falsch-falsch" }) })).status, 401);

    const anmeldung = await holen("/api/anmelden", { method: "POST", body: JSON.stringify({ passwort: PASSWORT }) });
    assert.equal(anmeldung.status, 200);
    const verwalter = cookieAus(anmeldung);
    assert.equal((await (await holen("/api/ich", { cookie: verwalter })).json()).rolle, "verwalter");

    const lied = await (await holen("/lieder/hosezerrissen.json")).json();
    const { spur } = textAufZeilen(lied, "Ich hab die Hose mir zerrissen\nbeim Bücken");
    assert.equal((await holen("/api/texte/hosezerrissen", { method: "PUT", body: JSON.stringify(spur) })).status, 401);
    const gespeichert = await holen("/api/texte/hosezerrissen", { method: "PUT", cookie: verwalter, body: JSON.stringify(spur) });
    assert.equal(gespeichert.status, 200);

    const kaputt = { ...spur, silben: [{ ab: 0, lang: 5, text: "zu" }, { ab: 1, lang: 1, text: "lang" }] };
    assert.equal((await holen("/api/texte/hosezerrissen", { method: "PUT", cookie: verwalter, body: JSON.stringify(kaputt) })).status, 400);
    assert.equal((await holen("/api/texte/entchen", { method: "PUT", cookie: verwalter, body: JSON.stringify(spur) })).status, 400, "gemeinfrei");

    const liste = await (await holen("/api/lieder", { cookie: verwalter })).json();
    assert.equal(liste.find((eintrag) => eintrag.id === "hosezerrissen").mitText, true);
    assert.equal((await (await holen("/api/lieder")).json()).find((eintrag) => eintrag.id === "hosezerrissen").mitText, false);

    /* Einmal-Link: macht ein Geraet zum Gast, der lesen, aber nicht schreiben darf */
    const link = await (await holen("/api/einmal-link", { method: "POST", cookie: verwalter, body: JSON.stringify({ name: "Lena" }) })).json();
    const eingeloest = await holen(link.pfad);
    assert.equal(eingeloest.status, 303);
    const gast = cookieAus(eingeloest);
    assert.equal((await holen("/api/texte/hosezerrissen", { cookie: gast })).status, 200);
    assert.equal((await holen("/api/texte/hosezerrissen", { method: "PUT", cookie: gast, body: JSON.stringify(spur) })).status, 403);
    assert.equal((await holen("/api/einmal-link", { method: "POST", cookie: gast, body: "{}" })).status, 403);
    assert.match((await holen(link.pfad)).headers.get("location"), /link=benutzt/);
  } finally {
    server.close();
  }
});

test("Schutz: fremde Herkunft, falsche Art, Bremse beim Durchprobieren", async () => {
  const { server, holen } = await testServer();
  try {
    const fremd = await holen("/api/anmelden", { method: "POST", body: JSON.stringify({ passwort: PASSWORT }), headers: { Origin: "https://boese.example" } });
    assert.equal(fremd.status, 403);
    assert.equal((await holen("/api/anmelden", { method: "POST", body: "passwort=x", headers: { "Content-Type": "text/plain" } })).status, 415);
    const status = [];
    for (let i = 0; i < 11; i++) {
      status.push((await holen("/api/anmelden", { method: "POST", body: JSON.stringify({ passwort: "falsch-falsch" }) })).status);
    }
    assert.equal(status.at(-1), 429);
    assert.equal((await holen("/api/anmelden", { method: "POST", body: JSON.stringify({ passwort: PASSWORT }) })).status, 429, "auch das richtige Passwort wartet");
  } finally {
    server.close();
  }
});
