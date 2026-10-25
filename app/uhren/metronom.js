/* Metronom-Uhr: die Position in Vierteln laeuft auf der Uhr der Web-Audio-Schnittstelle,
   damit Anzeige und Klick nicht auseinanderdriften. Ein Takt Einzaehlen vor dem Anfang. */
import { sekundeBei, positionBei, viertelProTakt } from "../kern/liedspur.js";

const VORLAUF_VIERTEL = 0.25; /* so weit im Voraus werden Klicks eingeplant */

export function metronomUhr(lied) {
  const proTakt = viertelProTakt(lied);
  let ton = null, anker = 0, gehalten = -proTakt, laeuft = false, tempoFaktor = 1, klickAn = true, naechsterKlick = -proTakt;

  function position() {
    return laeuft ? positionBei(lied, ton.currentTime - anker, tempoFaktor) : gehalten;
  }
  function verankern(pos) {
    anker = ton.currentTime - sekundeBei(lied, pos, tempoFaktor);
    naechsterKlick = Math.ceil(pos - 1e-6);
  }
  function klick(zeit, betont) {
    const schwingung = ton.createOscillator(), lautstaerke = ton.createGain();
    schwingung.frequency.value = betont ? 1480 : 990;
    lautstaerke.gain.setValueAtTime(0.22, zeit);
    lautstaerke.gain.exponentialRampToValueAtTime(0.001, zeit + 0.05);
    schwingung.connect(lautstaerke).connect(ton.destination);
    schwingung.start(zeit);
    schwingung.stop(zeit + 0.06);
  }

  return {
    position,
    get laeuft() { return laeuft; },
    get einzaehlen() { return proTakt; },
    starten() {
      ton ??= new AudioContext();
      ton.resume();
      verankern(gehalten);
      laeuft = true;
    },
    anhalten() {
      gehalten = position();
      laeuft = false;
    },
    springen(pos) {
      gehalten = pos;
      if (laeuft) verankern(pos);
    },
    tempoSetzen(faktor) {
      const pos = position();
      tempoFaktor = faktor;
      if (laeuft) verankern(pos);
    },
    klickSetzen(an) { klickAn = an; },
    /* aus jedem Bild der Anzeige aufrufen: plant die Klicks der naechsten Viertel ein */
    klicksEinplanen() {
      if (!laeuft) return;
      const pos = position();
      while (naechsterKlick <= pos + VORLAUF_VIERTEL && naechsterKlick < lied.laenge) {
        if (klickAn) klick(anker + sekundeBei(lied, naechsterKlick, tempoFaktor), ((naechsterKlick % proTakt) + proTakt) % proTakt === 0);
        naechsterKlick++;
      }
    },
    beenden() {
      laeuft = false;
      ton?.close();
    },
  };
}
