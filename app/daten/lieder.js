/* Lieder vom Server holen. Jede Liedspur wird vor der Anzeige geprueft. */
import { pruefen } from "../kern/liedspur.js";

let uebersicht = null;

export async function liederListe() {
  if (!uebersicht) {
    const antwort = await fetch("/api/lieder");
    if (!antwort.ok) throw new Error(`Liederliste nicht erreichbar (${antwort.status})`);
    uebersicht = await antwort.json();
  }
  return uebersicht;
}

/* Die Liednummer ist der Platz in der Liste, wie im Liederbuch. */
export async function liedNummer(id) {
  const index = (await liederListe()).findIndex((lied) => lied.id === id);
  return index < 0 ? null : index + 1;
}

export async function liedLaden(id) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Unbekanntes Lied");
  const antwort = await fetch(`/lieder/${id}.json`);
  if (antwort.status === 404) throw new Error("Dieses Lied gibt es nicht");
  if (!antwort.ok) throw new Error(`Lied nicht ladbar (${antwort.status})`);
  const lied = await antwort.json();
  const fehler = pruefen(lied);
  if (fehler.length) throw new Error(`Lieddatei fehlerhaft: ${fehler[0]}`);
  return lied;
}
