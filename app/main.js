/* Einstieg: waehlt anhand der Adresse die Ansicht (#/ Liste, #/lied/<id> Mitspielen). */
import { listeZeigen } from "./ansicht/liste.js";
import { mitspielenZeigen } from "./ansicht/mitspielen.js";

const wurzel = document.getElementById("app");
let aufraeumen = () => {};

async function zeigen() {
  aufraeumen();
  const lied = /^#\/lied\/([a-z0-9-]+)$/.exec(location.hash);
  aufraeumen = lied ? await mitspielenZeigen(wurzel, lied[1]) : await listeZeigen(wurzel);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", zeigen);
zeigen();
