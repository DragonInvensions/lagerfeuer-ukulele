/* Metronom-Uhr: die Position in Vierteln laeuft auf der Uhr der Web-Audio-Schnittstelle,
   damit Anzeige und Klang nicht auseinanderdriften. Ein Takt Einzaehlen vor dem Anfang.
   Was auf welchem Achtel erklingt, entscheidet kern/taktgeber.js; hier wird es nur gespielt. */
import { sekundeBei, positionBei, viertelProTakt } from "../kern/liedspur.js";
import { klangAufAchtel } from "../kern/taktgeber.js";

const VORLAUF_VIERTEL = 0.25; /* so weit im Voraus werden Klaenge eingeplant */

export function metronomUhr(lied, muster) {
  const proTakt = viertelProTakt(lied);
  let ton = null, rauschen = null, anker = 0, gehalten = -proTakt, laeuft = false, tempoFaktor = 1;
  let modus = "takt", naechstesAchtel = -proTakt * 2;

  function position() {
    return laeuft ? positionBei(lied, ton.currentTime - anker, tempoFaktor) : gehalten;
  }
  function verankern(pos) {
    anker = ton.currentTime - sekundeBei(lied, pos, tempoFaktor);
    naechstesAchtel = Math.ceil(pos * 2 - 1e-6);
  }

  /* Ein kurzer Ton mit fallender Tonhoehe: tief und voll fuer ab, hell und knapp fuer auf */
  function tonSpielen(zeit, { von, bis, dauer, lautstaerke, form = "sine" }) {
    const schwingung = ton.createOscillator(), huelle = ton.createGain();
    schwingung.type = form;
    schwingung.frequency.setValueAtTime(von, zeit);
    schwingung.frequency.exponentialRampToValueAtTime(bis, zeit + dauer);
    huelle.gain.setValueAtTime(lautstaerke, zeit);
    huelle.gain.exponentialRampToValueAtTime(0.001, zeit + dauer);
    schwingung.connect(huelle).connect(ton.destination);
    schwingung.start(zeit);
    schwingung.stop(zeit + dauer + 0.01);
  }
  /* Chunk: gedaempftes Klacken aus gefiltertem Rauschen */
  function klackSpielen(zeit, lautstaerke) {
    if (!rauschen) {
      rauschen = ton.createBuffer(1, Math.round(ton.sampleRate * 0.05), ton.sampleRate);
      const daten = rauschen.getChannelData(0);
      for (let i = 0; i < daten.length; i++) daten[i] = Math.random() * 2 - 1;
    }
    const quelle = ton.createBufferSource(), filter = ton.createBiquadFilter(), huelle = ton.createGain();
    quelle.buffer = rauschen;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    huelle.gain.setValueAtTime(lautstaerke, zeit);
    huelle.gain.exponentialRampToValueAtTime(0.001, zeit + 0.045);
    quelle.connect(filter).connect(huelle).connect(ton.destination);
    quelle.start(zeit);
  }
  function klangSpielen(zeit, { art, betont }) {
    const lauter = betont ? 1.4 : 1;
    if (art === "klick") tonSpielen(zeit, { von: betont ? 1480 : 990, bis: betont ? 1400 : 940, dauer: 0.05, lautstaerke: 0.22 });
    if (art === "ab") tonSpielen(zeit, { von: 300, bis: 150, dauer: 0.13, lautstaerke: 0.32 * lauter, form: "triangle" });
    if (art === "auf") tonSpielen(zeit, { von: 1250, bis: 1000, dauer: 0.06, lautstaerke: 0.14 * lauter });
    if (art === "chunk") klackSpielen(zeit, 0.5 * lauter);
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
    modusSetzen(neuerModus) { modus = neuerModus; },
    /* aus jedem Bild der Anzeige aufrufen: plant die Klaenge der naechsten Achtel ein */
    klaengeEinplanen() {
      if (!laeuft) return;
      const pos = position();
      while (naechstesAchtel / 2 <= pos + VORLAUF_VIERTEL && naechstesAchtel / 2 < lied.laenge) {
        const klang = klangAufAchtel(lied, muster, modus, naechstesAchtel);
        if (klang) klangSpielen(anker + sekundeBei(lied, naechstesAchtel / 2, tempoFaktor), klang);
        naechstesAchtel++;
      }
    },
    beenden() {
      laeuft = false;
      ton?.close();
    },
  };
}
