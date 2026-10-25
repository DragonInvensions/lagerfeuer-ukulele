/* Anmeldung aus Sicht der App: wer bin ich (Verwalter, Gast oder niemand), anmelden, abmelden, Einmal-Link. */
let rolleZwischengespeichert;

async function senden(pfad, wert) {
  const antwort = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(wert ?? {}) });
  const inhalt = await antwort.json().catch(() => ({}));
  if (!antwort.ok) throw new Error(inhalt.fehler ?? `Der Server antwortet mit ${antwort.status}.`);
  return inhalt;
}

export async function rolle() {
  if (rolleZwischengespeichert === undefined) {
    const antwort = await fetch("/api/ich");
    rolleZwischengespeichert = antwort.ok ? (await antwort.json()).rolle : null;
  }
  return rolleZwischengespeichert;
}

export async function anmelden(passwort) {
  rolleZwischengespeichert = (await senden("/api/anmelden", { passwort })).rolle;
}

export async function abmelden() {
  await senden("/api/abmelden");
  rolleZwischengespeichert = null;
}

export async function einmalLinkErzeugen(name) {
  const { pfad } = await senden("/api/einmal-link", { name });
  return new URL(pfad, location.origin).href;
}
