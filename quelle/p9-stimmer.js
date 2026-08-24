<script>
"use strict";
/* ==========================================================
   STIMMGERAET ueber das Mikrofon

   Tonhoehe wird per normalisierter Autokorrelation bestimmt.
   Absichtlich NICHT die FFT des AnalyserNode: bei 2048 Punkten
   und 48 kHz sind die Bins rund 23 Hz breit — zwischen C (262 Hz)
   und Cis (277 Hz) liegen aber nur 15 Hz. Zum Stimmen braucht es
   Genauigkeit im Bereich von Cent, nicht von Halbtoenen.
   ========================================================== */

var SAITEN_HIGH = [
  {n:"g", f:392.00, lage:"4. Saite (oben)"},
  {n:"C", f:261.63, lage:"3. Saite"},
  {n:"E", f:329.63, lage:"2. Saite"},
  {n:"A", f:440.00, lage:"1. Saite (unten)"}
];
var SAITEN_LOW = [
  {n:"G", f:196.00, lage:"4. Saite (oben), Low G"},
  {n:"C", f:261.63, lage:"3. Saite"},
  {n:"E", f:329.63, lage:"2. Saite"},
  {n:"A", f:440.00, lage:"1. Saite (unten)"}
];
var TONNAMEN = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

var stStream = null, stCtx = null, stAn = null, stBuf = null, stTimer = null;
var stLetzte = [];          /* kleiner Puffer, damit die Anzeige nicht zappelt */
var stStilleSeit = 0;

function stSaiten(){
  var el = document.getElementById("lowG");
  return (el && el.checked) ? SAITEN_LOW : SAITEN_HIGH;
}

/* ---------- Tonhoehe aus dem Zeitsignal ----------
   Normalisierte Autokorrelation im plausiblen Bereich. Der Lag-Bereich
   ist begrenzt (rund 70–1200 Hz), sonst waere die Rechnung zu langsam
   und der Griff nach Oktavfehlern zu gross. */
function tonhoehe(buf, rate){
  var n = buf.length, i, j;

  var summe = 0;
  for(i = 0; i < n; i++) summe += buf[i] * buf[i];
  var rms = Math.sqrt(summe / n);
  if(rms < 0.008) return null;                 /* zu leise: nichts gespielt */

  var minLag = Math.floor(rate / 1200);
  var maxLag = Math.floor(rate / 70);
  if(maxLag > n / 2) maxLag = Math.floor(n / 2);

  var beste = -1, besterLag = -1, werte = new Float32Array(maxLag + 1);
  for(var lag = minLag; lag <= maxLag; lag++){
    var s = 0, e1 = 0, e2 = 0, ende = n - lag;
    for(j = 0; j < ende; j++){
      var a = buf[j], b = buf[j + lag];
      s += a * b; e1 += a * a; e2 += b * b;
    }
    var nenner = Math.sqrt(e1 * e2);
    var w = nenner > 0 ? s / nenner : 0;
    werte[lag] = w;
    if(w > beste){ beste = w; besterLag = lag; }
  }
  if(beste < 0.5 || besterLag < 0) return null;  /* kein klarer Ton */

  /* Oktavfehler vermeiden: den FRUEHESTEN Gipfel nehmen, der fast so hoch
     ist wie der beste. Sonst rastet die Anzeige gern eine Oktave zu tief ein. */
  var schwelle = beste * 0.9, lagWahl = besterLag;
  for(var k = minLag + 1; k < besterLag; k++){
    if(werte[k] > schwelle && werte[k] >= werte[k-1] && werte[k] >= werte[k+1]){
      lagWahl = k; break;
    }
  }

  /* Parabel durch die drei Punkte um den Gipfel: bringt Bruchteile
     eines Samples und damit die noetige Cent-Genauigkeit. */
  var y1 = werte[lagWahl - 1] || 0, y2 = werte[lagWahl], y3 = werte[lagWahl + 1] || 0;
  var nen = 2 * (2 * y2 - y1 - y3);
  var fein = nen !== 0 ? lagWahl + (y3 - y1) / nen : lagWahl;

  var f = rate / fein;
  if(!isFinite(f) || f < 60 || f > 1400) return null;
  return {f:f, klar:beste};
}

/* ---------- Anzeige ---------- */
function centAbstand(f, ziel){ return 1200 * Math.log(f / ziel) / Math.LN2; }

function naechsteSaite(f){
  var s = stSaiten(), beste = null, kleinster = 1e9;
  s.forEach(function(x){
    var d = Math.abs(centAbstand(f, x.f));
    if(d < kleinster){ kleinster = d; beste = x; }
  });
  return {saite:beste, cent:centAbstand(f, beste.f)};
}

function tonName(f){
  var halb = 12 * Math.log(f / 440) / Math.LN2;
  var midi = Math.round(halb) + 69;
  var name = TONNAMEN[((midi % 12) + 12) % 12];
  var okt = Math.floor(midi / 12) - 1;
  return name + okt;
}

/* ---------- Bogenskala aufbauen ----------
   Mittelpunkt (160,162), Radius 118, +-50 Cent entsprechen +-60 Grad. */
var SK_CX = 160, SK_CY = 162, SK_R = 118, SK_PROCENT = 1.2;

function skPunkt(cent, r){
  var w = cent * SK_PROCENT * Math.PI / 180;
  return [SK_CX + r * Math.sin(w), SK_CY - r * Math.cos(w)];
}
function skBogenPfad(vonCent, bisCent, r){
  var a = skPunkt(vonCent, r), b = skPunkt(bisCent, r);
  return "M " + a[0].toFixed(1) + " " + a[1].toFixed(1)
       + " A " + r + " " + r + " 0 0 1 " + b[0].toFixed(1) + " " + b[1].toFixed(1);
}
var skGebaut = false;
function skalaBauen(){
  if(skGebaut) return;
  var ticks = document.getElementById("skTicks");
  if(!ticks) return;
  var teile = [];
  for(var c = -50; c <= 50; c += 5){
    var gross = (c % 25 === 0);
    var a = skPunkt(c, SK_R), b = skPunkt(c, gross ? 100 : 108);
    teile.push('<line class="'+(gross?"gross":"")+'" x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)
             + '" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'"/>');
  }
  [[-50,"−50"],[0,"0"],[50,"+50"]].forEach(function(x){
    var p = skPunkt(x[0], 134);
    teile.push('<text x="'+p[0].toFixed(1)+'" y="'+p[1].toFixed(1)+'">'+x[1]+'</text>');
  });
  ticks.innerHTML = teile.join("");
  document.getElementById("skBogen").setAttribute("d", skBogenPfad(-50, 50, SK_R));
  document.getElementById("skZiel").setAttribute("d", skBogenPfad(-5, 5, SK_R));
  skGebaut = true;
}

function stZeichnen(erg){
  var elSaite = document.getElementById("stimmSaite");
  var elTon   = document.getElementById("stimmTon");
  var elHz    = document.getElementById("stimmHz");
  var nadel   = document.getElementById("meterNadel");
  var cent    = document.getElementById("meterCent");
  var box     = document.getElementById("stimm");

  if(!erg){
    stStilleSeit++;
    if(stStilleSeit > 6){                       /* rund eine Sekunde Ruhe */
      elSaite.textContent = "–";
      elTon.textContent = "Spiel eine Saite";
      elHz.textContent = "";
      cent.textContent = "";
      nadel.setAttribute("transform", "rotate(0 " + SK_CX + " " + SK_CY + ")");
      box.className = "stimm";
    }
    return;
  }
  stStilleSeit = 0;

  /* Median der letzten Messungen: einzelne Ausreisser sollen die
     Nadel nicht springen lassen. */
  stLetzte.push(erg.f);
  if(stLetzte.length > 5) stLetzte.shift();
  var sortiert = stLetzte.slice().sort(function(a,b){ return a-b; });
  var f = sortiert[Math.floor(sortiert.length / 2)];

  var nah = naechsteSaite(f);
  var c = Math.round(nah.cent);
  var betrag = Math.abs(c);

  elSaite.textContent = nah.saite.n;

  /* Weit daneben? Dann kann es an der falschen Stimmung liegen: eine Low-G-Ukulele
     bei High-G-Einstellung landet sonst kommentarlos bei "C, weit daneben". */
  var andere = null;
  if(betrag > 60){                       /* nur pruefen, wenn es ohnehin nicht sitzt */
    var ander = (document.getElementById("lowG") || {}).checked ? SAITEN_HIGH : SAITEN_LOW;
    var beste = betrag;
    ander.forEach(function(x){
      var d = Math.abs(centAbstand(f, x.f));
      /* Die andere Stimmung muss deutlich besser passen UND nahe dran sein.
         Keine feste Cent-Schwelle: eine einfach nur verstimmte Saite soll
         nicht faelschlich als falsche Stimmung gemeldet werden. */
      if(d <= 50 && d < beste - 20){ beste = d; andere = x; }
    });
  }

  elTon.textContent = betrag <= 5 ? "sitzt"
                    : andere ? "Das klingt nach " + andere.n + " — schalt unten die Stimmung um"
                    : c < 0 ? "zu tief — höher drehen"
                            : "zu hoch — tiefer drehen";
  elHz.textContent = f.toFixed(1) + " Hz · Ziel " + nah.saite.f.toFixed(1)
                   + " Hz · klingt wie " + tonName(f);

  var pos = Math.max(-50, Math.min(50, c));
  nadel.setAttribute("transform",
    "rotate(" + (pos * SK_PROCENT).toFixed(2) + " " + SK_CX + " " + SK_CY + ")");
  cent.textContent = (c > 0 ? "+" : "") + c + " Cent"
                   + (betrag > 50 ? " · weit daneben" : "");

  box.className = "stimm " + (betrag <= 5 ? "gut" : betrag <= 20 ? "nah" : "weit");

  document.querySelectorAll("#saiten .saite").forEach(function(el){
    el.classList.toggle("aktiv", el.dataset.n === nah.saite.n);
    el.classList.toggle("fertig", el.dataset.n === nah.saite.n && betrag <= 5);
  });
}

function saitenListe(){
  var w = document.getElementById("saiten");
  if(!w) return;
  w.innerHTML = stSaiten().map(function(s){
    return '<button class="saite" data-n="'+s.n+'" data-f="'+s.f+'">'
      + '<span class="saite-n">'+s.n+'</span>'
      + '<span class="saite-l">'+s.lage+'</span>'
      + '<span class="saite-f">'+s.f.toFixed(0)+' Hz</span>'
      + '</button>';
  }).join("");
}

/* ---------- Mikrofon an und aus ---------- */
function startStimmer(){
  var fehler = document.getElementById("stimmFehler");
  fehler.hidden = true;

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    fehler.hidden = false;
    fehler.innerHTML = "Dieser Browser gibt kein Mikrofon frei. Das passiert vor allem, wenn die "
      + "Buchdatei direkt von der Festplatte geöffnet wurde — über die Webseite funktioniert es.";
    return;
  }

  navigator.mediaDevices.getUserMedia({audio:{
      echoCancellation:false, noiseSuppression:false, autoGainControl:false
    }}).then(function(stream){
    stStream = stream;
    stCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(stCtx.state === "suspended") stCtx.resume();
    var quelle = stCtx.createMediaStreamSource(stream);
    /* Tiefen abschneiden: Brummen und Trittschall verwirren die Autokorrelation */
    var hp = stCtx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 60;
    stAn = stCtx.createAnalyser();
    stAn.fftSize = 4096;
    quelle.connect(hp); hp.connect(stAn);
    stBuf = new Float32Array(stAn.fftSize);

    document.getElementById("stimmStart").hidden = true;
    document.getElementById("stimmLive").hidden = false;
    skalaBauen();
    saitenListe();
    stLetzte = []; stStilleSeit = 0;

    /* rund achtmal pro Sekunde: genau genug fuers Auge, sparsam fuer den Akku */
    stTimer = setInterval(function(){
      stAn.getFloatTimeDomainData(stBuf);
      stZeichnen(tonhoehe(stBuf, stCtx.sampleRate));
    }, 120);
  }).catch(function(e){
    fehler.hidden = false;
    fehler.textContent = (e && e.name === "NotAllowedError")
      ? "Der Zugriff aufs Mikrofon wurde abgelehnt. Du kannst ihn in den Seiteneinstellungen "
        + "deines Browsers wieder erlauben (Schloss-Symbol neben der Adresse)."
      : "Das Mikrofon lässt sich nicht öffnen" + (e && e.name ? " (" + e.name + ")" : "") + ".";
  });
}

function stopStimmer(){
  if(stTimer){ clearInterval(stTimer); stTimer = null; }
  if(stStream){ stStream.getTracks().forEach(function(t){ t.stop(); }); stStream = null; }
  if(stCtx){ stCtx.close(); stCtx = null; }
  stAn = null; stBuf = null; stLetzte = [];
  var live = document.getElementById("stimmLive");
  var start = document.getElementById("stimmStart");
  if(live) live.hidden = true;
  if(start) start.hidden = false;
  var box = document.getElementById("stimm");
  if(box) box.className = "stimm";
}

document.addEventListener("click", function(e){
  if(e.target.id === "micOn"){ startStimmer(); }
  if(e.target.id === "micOff"){ stopStimmer(); }
});
document.addEventListener("change", function(e){
  if(e.target.id === "lowG"){ saitenListe(); stLetzte = []; }
});
/* Mikrofon nicht im Hintergrund weiterlaufen lassen */
document.addEventListener("visibilitychange", function(){
  if(document.hidden && stStream) stopStimmer();
});
</script>
