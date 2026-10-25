/* Lieder vom Server holen. Jede Liedspur wird vor der Anzeige geprueft; bei geschuetzten Liedern
   kommt der Text als private Textspur dazu, wenn man angemeldet ist. */
import { pruefen } from "../kern/liedspur.js";
import { textspurAnwenden } from "../kern/textspur.js";

let uebersicht = null;

export async function liederListe() {
  if (!uebersicht) {
    const antwort = await fetch("/api/lieder");
    if (!antwort.ok) throw new Error(`Liederliste nicht erreichbar (${antwort.status})`);
    uebersicht = await antwort.json();
  }
  return uebersicht;
}

/* Nach Anmelden, Abmelden oder Speichern aendert sich, welche Lieder Text haben */
export function listeVergessen() {
  uebersicht = null;
}

/* Die Liednummer ist der Platz in der Liste, wie im Liederbuch. */
export async function liedNummer(id) {
  const index = (await liederListe()).findIndex((lied) => lied.id === id);
  return index < 0 ? null : index + 1;
}

export async function liedLaden(id, { mitPrivatemText = true } = {}) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Unbekanntes Lied");
  const antwort = await fetch(`/lieder/${id}.json`);
  if (antwort.status === 404) throw new Error("Dieses Lied gibt es nicht");
  if (!antwort.ok) throw new Error(`Lied nicht ladbar (${antwort.status})`);
  let lied = await antwort.json();
  if (mitPrivatemText && !lied.gemeinfrei) lied = textspurAnwenden(lied, await textspurLaden(id));
  const fehler = pruefen(lied);
  if (fehler.length) throw new Error(`Lieddatei fehlerhaft: ${fehler[0]}`);
  return lied;
}

/* Private Textspur; null, wenn es keine gibt oder man nicht angemeldet ist */
export async function textspurLaden(id) {
  const antwort = await fetch(`/api/texte/${id}`);
  if (antwort.status === 401 || antwort.status === 404) return null;
  if (!antwort.ok) throw new Error(`Text nicht ladbar (${antwort.status})`);
  return antwort.json();
}

export async function textspurSpeichern(id, spur) {
  const antwort = await fetch(`/api/texte/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(spur) });
  const inhalt = await antwort.json().catch(() => ({}));
  if (!antwort.ok) throw new Error(inhalt.fehler ?? `Der Server antwortet mit ${antwort.status}.`);
  listeVergessen();
}
