/* Mitsingen-Runden beim Server: anlegen, Stand melden, beenden, mitlesen.
   Jedes Geraet misst mit seiner gleichmaessig laufenden Uhr (performance, springt nicht bei Zeitumstellung);
   den Versatz zur Server-Uhr liefern die Antwortzeiten (kern/runde.js). */
import { uhrVersatz } from "../kern/runde.js";

const SPEICHER = "ukulele.runde";
const HOECHSTENS_PROBEN = 8;

export const ortsZeit = () => performance.timeOrigin + performance.now();

/* Die laufende Runde gilt fuer den Tab: sie ueberlebt Liedwechsel und Neuladen, nicht das Schliessen */
export function gemerkteRunde() {
  try {
    return sessionStorage.getItem(SPEICHER);
  } catch (fehler) {
    console.info("Runde nicht lesbar:", fehler.message);
    return null;
  }
}
function rundeMerken(token) {
  try {
    if (token) sessionStorage.setItem(SPEICHER, token); else sessionStorage.removeItem(SPEICHER);
  } catch (fehler) {
    console.info("Runde nicht gemerkt:", fehler.message);
  }
}

export const rundenLink = (token) => `${location.origin}/#/mitsingen/${token}`;

async function antwortLesen(antwort) {
  const inhalt = await antwort.json().catch(() => ({}));
  if (!antwort.ok) throw Object.assign(new Error(inhalt.fehler ?? `Der Server antwortet mit ${antwort.status}.`), { status: antwort.status });
  return inhalt;
}

export async function rundeAnlegen(lied) {
  const antwort = await fetch("/api/runde", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lied }) });
  const { token } = await antwortLesen(antwort);
  rundeMerken(token);
  return token;
}

export async function rundeBeenden(token) {
  rundeMerken(null);
  await antwortLesen(await fetch(`/api/runde/${token}`, { method: "DELETE" }));
}

/* Meldet den Stand des Spielleiters, eine Meldung nach der anderen, damit keine aeltere eine neuere ueberholt.
   standHolen wird erst beim Senden gefragt, damit Stelle und Zeit zusammenpassen. */
export function standMelder(token, { standHolen, vorbei }) {
  const proben = [];
  let unterwegs = false, nochmal = false;

  return async function melden() {
    if (unterwegs) { nochmal = true; return; }
    unterwegs = true;
    try {
      const gesendet = ortsZeit(), stand = standHolen();
      if (proben.length) stand.serverZeit = gesendet + uhrVersatz(proben);
      const antwort = await fetch(`/api/runde/${token}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(stand) });
      const empfangen = ortsZeit();
      if (antwort.status === 404 || antwort.status === 403) {
        rundeMerken(null);
        vorbei();
        return;
      }
      const { serverZeit } = await antwortLesen(antwort);
      proben.push({ gesendet, empfangen, serverZeit });
      if (proben.length > HOECHSTENS_PROBEN) proben.shift();
    } catch (fehler) {
      console.info("Stand nicht gemeldet, der naechste Herzschlag versucht es wieder:", fehler.message);
    } finally {
      unterwegs = false;
      if (nochmal) { nochmal = false; melden(); }
    }
  };
}

/* Fuer die Freunde: Versatz messen, dann den Live-Strom hoeren. Wirft, wenn es die Runde nicht (mehr) gibt.
   EventSource verbindet nach einem Abriss selbst neu; danach wird der Versatz neu gemessen. */
export async function rundeVerfolgen(token, { stand, ende, verbindung }) {
  let versatz = await versatzMessen(token), abgerissen = false;
  const neuMessen = () => versatzMessen(token).then((neu) => { versatz = neu; }, (fehler) => console.info("Versatz nicht neu gemessen:", fehler.message));

  const quelle = new EventSource(`/api/runde/${token}/strom`);
  quelle.addEventListener("open", () => {
    verbindung(true);
    if (abgerissen) neuMessen();
  });
  quelle.addEventListener("message", (ereignis) => stand(JSON.parse(ereignis.data)));
  quelle.addEventListener("ende", () => { quelle.close(); ende(); });
  quelle.addEventListener("error", () => {
    abgerissen = true;
    /* Geschlossen heisst: der Server kennt die Runde nicht mehr (etwa nach einem Neustart) */
    if (quelle.readyState === EventSource.CLOSED) ende(); else verbindung(false);
  });

  return {
    serverJetzt: () => ortsZeit() + versatz,
    neuMessen,
    schliessen: () => quelle.close(),
  };
}

async function versatzMessen(token) {
  const proben = [];
  for (let i = 0; i < 3; i++) {
    const gesendet = ortsZeit();
    const { serverZeit } = await antwortLesen(await fetch(`/api/runde/${token}`));
    proben.push({ gesendet, empfangen: ortsZeit(), serverZeit });
  }
  return uhrVersatz(proben);
}

/* Text des laufenden Lieds (geschuetzte Lieder); null, wenn keiner abgelegt ist */
export async function rundentextLaden(token, lied) {
  const antwort = await fetch(`/api/runde/${token}/text/${lied}`);
  if (antwort.status === 404) return null;
  return antwortLesen(antwort);
}
