/* Anmeldung ohne Fremdpakete, nach dem Muster des Hoerpults.
   Passwort:    nur Jakob als Verwalter, scrypt mit zufaelligem Salz.
   Sitzungen:   signierter Cookie (HMAC-SHA256), kein Sitzungsspeicher. Er traegt eine Versionsnummer;
                wird das Passwort neu gesetzt, steigt sie und alle Sitzungen sind entwertet.
   Einmal-Link: 128-Bit-Zufallstoken, gespeichert nur als Hash, einmal einloesbar und 14 Tage gueltig.
                Er meldet ein Geraet als Gast an: Texte lesen, nicht aendern. */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const COOKIE = "ukulele";
const SITZUNG_TAGE = 30;
const LINK_TAGE = 14;
const SCRYPT = { N: 16384, r: 8, p: 1, laenge: 64 };
export const ROLLEN = { verwalter: "verwalter", gast: "gast" };

export function zugangAnlegen(ordner, geheimnisAusUmgebung = process.env.UKULELE_GEHEIMNIS) {
  const datei = path.join(ordner, "zugang.json");
  const geheimnis = geheimnisAusUmgebung ? Buffer.from(geheimnisAusUmgebung, "utf8") : geheimnisAusDatei(ordner);

  function laden() {
    try {
      return JSON.parse(fs.readFileSync(datei, "utf8"));
    } catch (fehler) {
      if (fehler.code === "ENOENT") return { version: 1, passwort: null, sitzungsVersion: 1, links: [] };
      throw fehler;
    }
  }
  function sichern(daten) {
    const zwischen = `${datei}.${process.pid}.tmp`;
    fs.writeFileSync(zwischen, JSON.stringify(daten, null, 2), { mode: 0o600 });
    fs.renameSync(zwischen, datei);
  }
  function signieren(daten) {
    const roh = Buffer.from(JSON.stringify(daten), "utf8").toString("base64url");
    return `${roh}.${crypto.createHmac("sha256", geheimnis).update(roh).digest("base64url")}`;
  }
  function signaturPruefen(wert) {
    const trenner = wert.lastIndexOf(".");
    if (trenner < 0) return null;
    const roh = wert.slice(0, trenner), signatur = Buffer.from(wert.slice(trenner + 1));
    const soll = Buffer.from(crypto.createHmac("sha256", geheimnis).update(roh).digest("base64url"));
    if (signatur.length !== soll.length || !crypto.timingSafeEqual(signatur, soll)) return null;
    try {
      return JSON.parse(Buffer.from(roh, "base64url").toString("utf8"));
    } catch {
      return null;
    }
  }
  const hash = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");

  return {
    passwortGesetzt: () => Boolean(laden().passwort),

    passwortSetzen(klartext) {
      if (String(klartext).length < 10) throw new Error("Das Passwort braucht mindestens 10 Zeichen.");
      const salz = crypto.randomBytes(16);
      const wert = crypto.scryptSync(klartext, salz, SCRYPT.laenge, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
      const daten = laden();
      daten.passwort = { algo: "scrypt", ...SCRYPT, salz: salz.toString("base64"), hash: wert.toString("base64") };
      daten.sitzungsVersion = (daten.sitzungsVersion ?? 1) + 1;
      sichern(daten);
    },

    passwortPruefen(klartext) {
      const gespeichert = laden().passwort;
      if (!gespeichert) return false;
      const soll = Buffer.from(gespeichert.hash, "base64");
      const ist = crypto.scryptSync(String(klartext), Buffer.from(gespeichert.salz, "base64"), soll.length,
        { N: gespeichert.N, r: gespeichert.r, p: gespeichert.p });
      return crypto.timingSafeEqual(ist, soll);
    },

    cookieFuer(rolle, sicher) {
      const wert = signieren({ rolle, v: laden().sitzungsVersion, t: Date.now() });
      return [`${COOKIE}=${wert}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${SITZUNG_TAGE * 86400}`, ...(sicher ? ["Secure"] : [])].join("; ");
    },
    cookieLoeschen: () => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,

    /* Rolle aus dem Cookie-Kopf der Anfrage, sonst null */
    rolleAus(cookieKopf = "") {
      const eintrag = cookieKopf.split(";").map((teil) => teil.trim()).find((teil) => teil.startsWith(`${COOKIE}=`));
      const daten = eintrag && signaturPruefen(eintrag.slice(COOKIE.length + 1));
      if (!daten || !Object.values(ROLLEN).includes(daten.rolle)) return null;
      if (Date.now() - daten.t > SITZUNG_TAGE * 86400 * 1000) return null;
      if (daten.v !== laden().sitzungsVersion) return null;
      return daten.rolle;
    },

    einmalLinkAnlegen(name = "") {
      const token = crypto.randomBytes(16).toString("base64url");
      const daten = laden(), jetzt = Date.now();
      daten.links = (daten.links ?? []).filter((link) => !link.eingeloest && Date.parse(link.laeuftAb) > jetzt);
      daten.links.push({ hash: hash(token), name: String(name).slice(0, 60), erstellt: new Date(jetzt).toISOString(),
        laeuftAb: new Date(jetzt + LINK_TAGE * 86400 * 1000).toISOString(), eingeloest: null });
      sichern(daten);
      return token;
    },

    einmalLinkEinloesen(token) {
      const daten = laden();
      const link = (daten.links ?? []).find((eintrag) => eintrag.hash === hash(token));
      if (!link) return { fehler: "unbekannt" };
      if (link.eingeloest) return { fehler: "benutzt" };
      if (Date.parse(link.laeuftAb) < Date.now()) return { fehler: "abgelaufen" };
      link.eingeloest = new Date().toISOString();
      sichern(daten);
      return { rolle: ROLLEN.gast };
    },
  };
}

/* Ohne Umgebungsvariable: das Sitzungsgeheimnis einmalig erzeugen und neben die Daten legen */
function geheimnisAusDatei(ordner) {
  const datei = path.join(ordner, ".geheimnis");
  try {
    return fs.readFileSync(datei);
  } catch (fehler) {
    if (fehler.code !== "ENOENT") throw fehler;
    const neu = crypto.randomBytes(32);
    fs.mkdirSync(ordner, { recursive: true });
    fs.writeFileSync(datei, neu, { mode: 0o600 });
    return neu;
  }
}
