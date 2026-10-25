/* Einstieg: waehlt anhand der Adresse die Ansicht.
   #/ Liste · #/lied/<id> Mitspielen · #/lied/<id>/text Text einfuegen · #/anmelden · #/mitsingen/<runde> Freunde lesen mit */
import { listeZeigen } from "./ansicht/liste.js";
import { mitspielenZeigen } from "./ansicht/mitspielen.js";
import { mitsingenZeigen } from "./ansicht/mitsingen.js";
import { texteingabeZeigen } from "./ansicht/texteingabe.js";
import { anmeldenZeigen } from "./ansicht/anmelden.js";

const wurzel = document.getElementById("app");
let aufraeumen = () => {};

const ANSICHTEN = [
  { muster: /^#\/lied\/([a-z0-9-]+)$/, zeigen: (treffer) => mitspielenZeigen(wurzel, treffer[1]) },
  { muster: /^#\/lied\/([a-z0-9-]+)\/text$/, zeigen: (treffer) => texteingabeZeigen(wurzel, treffer[1]) },
  { muster: /^#\/anmelden(?:\?link=([a-z]+))?$/, zeigen: (treffer) => anmeldenZeigen(wurzel, treffer[1]) },
  { muster: /^#\/mitsingen\/([A-Za-z0-9_-]{22})$/, zeigen: (treffer) => mitsingenZeigen(wurzel, treffer[1]) },
];

async function zeigen() {
  aufraeumen();
  const ansicht = ANSICHTEN.map((eintrag) => ({ ...eintrag, treffer: eintrag.muster.exec(location.hash) })).find((eintrag) => eintrag.treffer);
  aufraeumen = ansicht ? await ansicht.zeigen(ansicht.treffer) : await listeZeigen(wurzel);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", zeigen);
zeigen();
