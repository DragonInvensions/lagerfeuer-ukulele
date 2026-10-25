/* Mitsingen-Runde: Jakobs Geraet meldet seinen Stand, die Freunde rechnen die Liedstelle daraus selbst weiter.
   Alle Zeiten in Millisekunden der Server-Uhr; jedes Geraet kennt seinen Versatz zu ihr. */
import { sekundeBei, positionBei } from "./liedspur.js";

/* stand: { position, faktor, laeuft, serverZeit } – position in Vierteln zum Zeitpunkt serverZeit */
export function positionNach(lied, stand, serverJetzt) {
  if (!stand.laeuft) return stand.position;
  const vergangen = Math.max(0, serverJetzt - stand.serverZeit) / 1000;
  return positionBei(lied, sekundeBei(lied, stand.position, stand.faktor) + vergangen, stand.faktor);
}

/* Versatz der eigenen Uhr zur Server-Uhr aus Proben { gesendet, empfangen, serverZeit } (gesendet/empfangen in eigener
   Zeit). Es zaehlt die Probe mit der kuerzesten Laufzeit; der Server hat ungefaehr in deren Mitte geantwortet. */
export function uhrVersatz(proben) {
  const laufzeit = (probe) => probe.empfangen - probe.gesendet;
  const beste = proben.reduce((bisher, probe) => (laufzeit(probe) < laufzeit(bisher) ? probe : bisher));
  return beste.serverZeit - (beste.gesendet + beste.empfangen) / 2;
}
