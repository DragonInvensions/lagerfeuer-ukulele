/* Mitsingen-Runden: Jakob spielt, Freunde lesen auf ihren Handys mit. Nur im Speicher, ein Neustart beendet alle Runden.
   Wer den Runden-Link kennt, sieht den Stand und den Text des gerade gespielten Lieds, sonst nichts. Der Link ist
   128 Bit zufaellig und gilt nur, solange die Runde laeuft. */
import { randomBytes } from "node:crypto";

const HOECHSTENS_RUNDEN = 3;
const HOECHSTENS_ZUHOERER = 30;
const RUHEZEIT = 6 * 60 * 60 * 1000;
const ERLAUBTE_UHRABWEICHUNG = 10 * 1000;
export const TOKEN_MUSTER = "[A-Za-z0-9_-]{22}";

/* Der gemeldete Stand kommt vom Handy des Spielleiters; nur Werte, mit denen die Freunde rechnen koennen. */
export function standAusEingabe(eingabe, serverJetzt) {
  const { lied, position, faktor, laeuft, serverZeit } = eingabe ?? {};
  if (typeof lied !== "string" || !/^[a-z0-9-]{1,60}$/.test(lied)) return { fehler: "Unbekanntes Lied." };
  if (!Number.isFinite(position) || position < -64 || position > 100_000) return { fehler: "Die Stelle im Lied ist ungültig." };
  if (!Number.isFinite(faktor) || faktor < 0.25 || faktor > 2) return { fehler: "Das Tempo ist ungültig." };
  if (typeof laeuft !== "boolean") return { fehler: "Es fehlt, ob das Lied läuft." };
  /* Eine Zeit mit zu grosser Abweichung stammt von einer falsch geschaetzten Uhr; dann zaehlt der Eingang beim Server. */
  const zeitPasst = Number.isFinite(serverZeit) && Math.abs(serverZeit - serverJetzt) <= ERLAUBTE_UHRABWEICHUNG;
  return { stand: { lied, position, faktor, laeuft, serverZeit: zeitPasst ? serverZeit : serverJetzt } };
}

export function rundenAnlegen({ jetzt = Date.now } = {}) {
  const runden = new Map();

  function beenden(token) {
    const runde = runden.get(token);
    if (!runde) return false;
    runden.delete(token);
    for (const zuhoerer of runde.zuhoerer) zuhoerer.ende();
    return true;
  }
  function laufende(token) {
    for (const [alt, runde] of runden) if (jetzt() - runde.zuletzt > RUHEZEIT) beenden(alt);
    return runden.get(token) ?? null;
  }

  return {
    anlegen(lied) {
      laufende(null);
      if (runden.size >= HOECHSTENS_RUNDEN) beenden(runden.keys().next().value);
      const token = randomBytes(16).toString("base64url");
      runden.set(token, { stand: { lied, position: 0, faktor: 1, laeuft: false, serverZeit: jetzt() }, zuletzt: jetzt(), zuhoerer: new Set() });
      return token;
    },
    stand: (token) => laufende(token)?.stand ?? null,
    melden(token, stand) {
      const runde = laufende(token);
      if (!runde) return false;
      runde.stand = stand;
      runde.zuletzt = jetzt();
      for (const zuhoerer of runde.zuhoerer) zuhoerer.senden(stand);
      return true;
    },
    beenden,
    /* Liefert eine Abmelde-Funktion, "voll" oder null (keine Runde) */
    zuhoeren(token, zuhoerer) {
      const runde = laufende(token);
      if (!runde) return null;
      if (runde.zuhoerer.size >= HOECHSTENS_ZUHOERER) return "voll";
      runde.zuhoerer.add(zuhoerer);
      return () => runde.zuhoerer.delete(zuhoerer);
    },
  };
}
