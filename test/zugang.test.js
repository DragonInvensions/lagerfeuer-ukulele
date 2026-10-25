import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { zugangAnlegen, ROLLEN } from "../server/zugang.js";

const ordner = () => fs.mkdtempSync(path.join(os.tmpdir(), "ukulele-zugang-"));
const cookieWert = (setCookie) => setCookie.split(";")[0];

test("Passwort: zu kurz abgelehnt, richtig und falsch erkannt", () => {
  const zugang = zugangAnlegen(ordner(), "geheim");
  assert.throws(() => zugang.passwortSetzen("kurz"), /mindestens 10/);
  zugang.passwortSetzen("lagerfeuer-am-see");
  assert.equal(zugang.passwortPruefen("lagerfeuer-am-see"), true);
  assert.equal(zugang.passwortPruefen("falsch-falsch"), false);
});

test("Sitzung: Cookie traegt die Rolle, gefaelschte Cookies zaehlen nicht", () => {
  const zugang = zugangAnlegen(ordner(), "geheim");
  const cookie = cookieWert(zugang.cookieFuer(ROLLEN.verwalter, false));
  assert.equal(zugang.rolleAus(cookie), ROLLEN.verwalter);
  const [name, wert] = cookie.split("=");
  const [roh, signatur] = wert.split(".");
  const gefaelscht = Buffer.from(JSON.stringify({ rolle: "verwalter", v: 99, t: Date.now() })).toString("base64url");
  assert.equal(zugang.rolleAus(`${name}=${gefaelscht}.${signatur}`), null);
  assert.equal(zugang.rolleAus(`${name}=${roh}.xxx`), null);
  assert.equal(zugangAnlegen(ordner(), "anderes-geheimnis").rolleAus(cookie), null);
});

test("Neues Passwort meldet alle Sitzungen ab", () => {
  const zugang = zugangAnlegen(ordner(), "geheim");
  zugang.passwortSetzen("erstes-passwort");
  const cookie = cookieWert(zugang.cookieFuer(ROLLEN.gast, false));
  assert.equal(zugang.rolleAus(cookie), ROLLEN.gast);
  zugang.passwortSetzen("zweites-passwort");
  assert.equal(zugang.rolleAus(cookie), null);
});

test("Einmal-Link: einmal einloesbar, macht zum Gast, nur der Hash wird gespeichert", () => {
  const verzeichnis = ordner();
  const zugang = zugangAnlegen(verzeichnis, "geheim");
  const token = zugang.einmalLinkAnlegen("Handy von Lena");
  assert.ok(!fs.readFileSync(path.join(verzeichnis, "zugang.json"), "utf8").includes(token));
  assert.deepEqual(zugang.einmalLinkEinloesen(token), { rolle: ROLLEN.gast });
  assert.deepEqual(zugang.einmalLinkEinloesen(token), { fehler: "benutzt" });
  assert.deepEqual(zugang.einmalLinkEinloesen("gibtesnicht12345"), { fehler: "unbekannt" });
});

test("Ohne Umgebungsvariable entsteht das Geheimnis einmal und bleibt", () => {
  const verzeichnis = ordner();
  const cookie = cookieWert(zugangAnlegen(verzeichnis, undefined).cookieFuer(ROLLEN.gast, false));
  assert.equal(zugangAnlegen(verzeichnis, undefined).rolleAus(cookie), ROLLEN.gast);
});
