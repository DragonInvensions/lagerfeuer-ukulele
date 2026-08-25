<script>
"use strict";
/* ==========================================================
   MITSPIELEN

   Fuehrt Takt fuer Takt durch ein Lied: zaehlt mit, zeigt den
   Akkord samt Griffbild, die Schlagrichtung des laufenden Schlags
   und die Textzeile, in der man gerade ist.

   Der Takt wird in ACHTELN gezaehlt — genau wie die Schlagmuster
   aufgebaut sind (8 Felder im 4/4, 6 im 3/4 und im 6/8). Damit sind
   Muster und Mitzaehler automatisch synchron.
   ========================================================== */

var msSong = null, msPat = null, msTakte = [], msZeilen = [];
var msTimer = null, msSlot = 0, msIndex = 0, msVor = 0, msNaechster = 0;
var msLaeuft = false;
var msTempo = 70;                     /* Prozent des Originaltempos */
var msSilbenModus = (typeof load === "function" && load("uke.mssilben") === "aus") ? false : true;

function msBpm(song, pat){
  var m = /(\d+)\s*bpm/i.exec(song.tempo || "");
  return m ? parseInt(m[1], 10) : (pat ? pat.bpm : 92);
}
function msSauber(s){ return String(s || "").replace(/\[[^\]]*\]/g, "").trim(); }

/* Textzeile in ihre Takte zerlegen — dieselbe Regel wie im Taktraster:
   ein Abschnitt mehr als Takte bedeutet Auftakt. */
function msSegmente(row, si, ri, song){
  var roh = row.x ? String(row.x) : (typeof lyricGet === "function" ? lyricGet(song.id, si, ri) : "");
  var n = row.b.length;
  if(!roh) return {auftakt:"", spalten:new Array(n).fill("")};
  if(roh.indexOf("|") === -1){
    var eine = new Array(n).fill("");
    eine[0] = roh;
    return {auftakt:"", spalten:eine};
  }
  var segs = roh.split("|").map(function(x){ return x.trim(); });
  var auftakt = "";
  if(segs.length > n){
    var vorne = segs.splice(0, segs.length - n + 1);
    auftakt = vorne.slice(0, -1).filter(Boolean).join(" ");
    segs.unshift(vorne[vorne.length - 1]);
  }
  while(segs.length < n) segs.push("");
  return {auftakt:auftakt, spalten:segs};
}

function msAufbauen(song){
  var xp = (typeof XP === "object" && XP[song.id]) ? XP[song.id] : 0;
  msPat = patternByName(song.strum) || PATTERNS[0];
  msTakte = []; msZeilen = [];
  song.secs.forEach(function(sec, si){
    sec.rows.forEach(function(row, ri){
      var seg = msSegmente(row, si, ri, song);
      var zi = msZeilen.length;
      msZeilen.push({abschnitt:sec.n, spalten:seg.spalten, auftakt:seg.auftakt});
      var letzter = null;
      row.b.forEach(function(c, bi){
        var akk = (c === "" ? letzter : c);
        if(c !== "") letzter = c;
        msTakte.push({akk: akk ? transposeChord(akk, xp) : null, zi: zi, bi: bi});
      });
    });
  });
  msSilbenplan();
}

/* ---------- Silben auf die Schlaege verteilen ----------
   Wo im Takt eine Silbe sitzt, steht nirgends in den Daten \u2014 gespeichert ist
   nur, WELCHE Silben in welchem Takt liegen. Sie werden deshalb gleichmaessig
   ueber den Takt verteilt: vier Silben im Viervierteltakt landen damit genau
   auf den vier Zaehlzeiten, zwei auf Eins und Drei. Das trifft bei Volksliedern
   fast immer, ist bei punktierten Rhythmen aber eine Naeherung \u2014 deshalb
   laesst sich die Silbenanzeige auch abschalten. */
function msSilbenAusText(s){
  var out = [];
  String(s || "").split(/\s+/).forEach(function(wort, wi){
    if(!wort) return;
    var teile = (typeof silbenTeilen === "function") ? silbenTeilen(wort) : [wort];
    teile.forEach(function(si, i){
      out.push({text: si, wortAnfang: i === 0, wi: wi});
    });
  });
  return out;
}

/* Baut fuer jede Zeile die Silben mit ihrer Position im Stueck.
   Position = Takt * FelderProTakt + Feld, also global durchgezaehlt. */
function msSilbenplan(){
  var slots = msPat.slots.length;
  msZeilen.forEach(function(z){ z.silben = []; });

  var zaehlzeiten = Math.round(slots / 2);   /* 4 im 4/4, 3 im 3/4 und 6/8 */

  /* Passen die Silben auf die Zaehlzeiten, kommen sie auch DORTHIN — sonst
     landet die letzte gern zwischen zwei Schlaegen. Drei Silben im
     Viervierteltakt heissen also Schlag 1, 2, 3 und nicht 1, 2, 3einhalb.
     Nur wenn es mehr Silben als Zaehlzeiten gibt, wird feiner geteilt. */
  function feld(i, anzahl){
    return anzahl <= zaehlzeiten
      ? Math.floor(i * zaehlzeiten / anzahl) * 2
      : Math.floor(i * slots / anzahl);
  }

  msTakte.forEach(function(t, ti){
    var z = msZeilen[t.zi];
    var silben = msSilbenAusText(msSauber(z.spalten[t.bi]));
    silben.forEach(function(s, i){
      s.pos = ti * slots + feld(i, silben.length);
      z.silben.push(s);
    });

    /* Auftakt: gehoert klanglich noch vor den ersten Takt der Zeile.
       Er wird deshalb ans Ende des VORHERGEHENDEN Takts gehaengt —
       von hinten gezaehlt, ebenfalls auf Zaehlzeiten. */
    if(t.bi === 0 && z.auftakt){
      var vor = msSilbenAusText(msSauber(z.auftakt));
      vor.forEach(function(s, i){
        var zz = Math.max(0, zaehlzeiten - vor.length + i);
        /* Ganz am Anfang gibt es keinen Takt davor. Dann bekommt der Auftakt
           eine NEGATIVE Position und leuchtet im Einzaehler auf — genau da
           wird er ja auch gesungen. */
        s.pos = ti > 0 ? (ti - 1) * slots + zz * 2
                       : (zz - zaehlzeiten) * 2;
        s.auftakt = true;
      });
      z.silben = vor.concat(z.silben);
    }
  });
}

/* ---------- Anzeige ---------- */
function msZaehlwerk(){
  var slots = msPat.slots.length;
  var namen = msPat.meter === "6/8" ? ["1","2","3","4","5","6"]
            : msPat.meter === "3/4" ? ["1","+","2","+","3","+"]
            : ["1","+","2","+","3","+","4","+"];
  var html = "";
  for(var i = 0; i < slots; i++){
    var s = msPat.slots[i];
    var pfeil = s === "D" ? "↓" : s === "U" ? "↑" : s === "x" ? "×" : "·";
    html += '<div class="ms-schlag' + (s === "-" ? " leer" : "") + '" data-slot="' + i + '">'
          + '<span class="ms-pfeil">' + pfeil + '</span>'
          + '<span class="ms-zahl">' + namen[i] + '</span></div>';
  }
  document.getElementById("msTakt").innerHTML = html;
}

function msZeileHTML(z, aktBi, klasse){
  if(!z) return '<div class="ms-zeile leer"></div>';
  var leer = z.spalten.every(function(s){ return !msSauber(s); });
  if(leer && !z.auftakt) return '<div class="ms-zeile ' + klasse + ' leer">\u2014</div>';

  /* Silbenweise nur in der laufenden Zeile \u2014 davor und danach waere es Unruhe */
  if(msSilbenModus && klasse === "ms-akt" && z.silben && z.silben.length){
    var html = "", offen = false;
    z.silben.forEach(function(s, i){
      if(s.wortAnfang){
        if(offen) html += '</span>';
        html += '<span class="ms-wort' + (s.auftakt ? " ms-auftakt" : "") + '">';
        offen = true;
      }
      html += '<span class="ms-silbe" data-p="' + s.pos + '">' + esc(s.text) + '</span>';
    });
    if(offen) html += '</span>';
    return '<div class="ms-zeile ' + klasse + ' silben">' + html + '</div>';
  }

  var teile = z.spalten.map(function(s, i){
    return '<span class="ms-sp' + (i === aktBi ? " an" : "") + '">' + esc(msSauber(s)) + '</span>';
  }).join("");
  return '<div class="ms-zeile ' + klasse + '">'
       + (z.auftakt ? '<span class="ms-auf">' + esc(msSauber(z.auftakt)) + '</span>' : '')
       + teile + '</div>';
}

/* Die gerade faellige Silbe hervorheben: die letzte, deren Position schon
   erreicht ist. So bleibt sie stehen, bis die naechste an der Reihe ist. */
function msSilbenZeigen(){
  if(!msSilbenModus) return;
  /* Waehrend des Einzaehlers laeuft die Position negativ auf null zu,
     damit ein Auftakt am Liedanfang dort schon aufleuchtet. */
  var pos = msVor > 0 ? -msVor : msIndex * msPat.slots.length + msSlot;
  var alle = document.querySelectorAll("#msText .ms-akt .ms-silbe");
  var aktiv = -1;
  alle.forEach(function(el, i){
    if(parseInt(el.dataset.p, 10) <= pos) aktiv = i;
  });
  alle.forEach(function(el, i){
    el.classList.toggle("ms-nun", i === aktiv);
    el.classList.toggle("ms-durch", i < aktiv);
  });
}

function msZeichnen(){
  var t = msTakte[msIndex];
  if(!t) return;
  var z = msZeilen[t.zi];

  document.getElementById("msAbschnitt").textContent =
    z.abschnitt + " · Takt " + (msIndex + 1) + " von " + msTakte.length;

  /* Akkord samt Griffbild, dazu der naechste zur Vorbereitung */
  var naechster = null;
  for(var i = msIndex + 1; i < msTakte.length; i++){
    if(msTakte[i].akk && msTakte[i].akk !== t.akk){ naechster = msTakte[i]; break; }
  }
  document.getElementById("msJetzt").innerHTML = t.akk
    ? '<div class="ms-gr">' + chordSVG(t.akk, 1.5) + '</div><div class="ms-name">' + esc(t.akk) + '</div>'
    : '<div class="ms-name">–</div>';
  document.getElementById("msNaechst").innerHTML = naechster
    ? '<span class="ms-vorschau">gleich</span><div class="ms-gr klein">'
      + chordSVG(naechster.akk, 0.85) + '</div><div class="ms-name klein">' + esc(naechster.akk) + '</div>'
    : "";

  document.getElementById("msText").innerHTML =
      msZeileHTML(msZeilen[t.zi - 1], -1, "ms-frueher")
    + msZeileHTML(z, t.bi, "ms-akt")
    + msZeileHTML(msZeilen[t.zi + 1], -1, "ms-spaeter");
  msSilbenZeigen();
}

function msSlotZeigen(){
  var felder = document.querySelectorAll("#msTakt .ms-schlag");
  felder.forEach(function(f, i){ f.classList.toggle("an", i === msSlot); });
}

/* ---------- Ablauf ---------- */
function msSlotMs(){
  var bpm = msBpm(msSong, msPat) * (msTempo / 100);
  return (60000 / bpm) / 2;           /* ein Feld = eine Achtel */
}

function msTick(){
  /* Einzaehler vor dem Start */
  if(msVor > 0){
    var proTakt = msPat.slots.length;
    var rest = Math.ceil(msVor / 2);
    document.getElementById("msAbschnitt").textContent = "Gleich geht’s los … " + rest;
    if(msVor % 2 === 1) click("D");
    msVor--;
    if(msVor === 0){ msSlot = 0; msIndex = 0; msZeichnen(); }
    msSilbenZeigen();
    return;
  }

  msSlotZeigen();
  msSilbenZeigen();
  var s = msPat.slots[msSlot];
  if(s !== "-" && document.getElementById("msKlick").checked) click(s);

  msSlot++;
  if(msSlot >= msPat.slots.length){
    msSlot = 0;
    msIndex++;
    if(msIndex >= msTakte.length){ msFertig(); return; }
    msZeichnen();
  }
}

/* Selbstkorrigierender Takt statt setInterval: setInterval haeuft Verzug an,
   und genau das faellt bei einem Metronom nach ein paar Minuten auf. Hier wird
   der naechste Schlag absolut geplant, der Verzug also jedes Mal herausgerechnet.
   Faellt der Rechner weit zurueck (Reiter im Hintergrund), wird neu aufgesetzt
   statt die verpassten Schlaege in einem Schwall nachzuholen. */
function msPlan(){
  var verzug = msNaechster - performance.now();
  if(verzug < -2 * msSlotMs()) msNaechster = performance.now() + msSlotMs();
  msTimer = setTimeout(function(){
    msNaechster += msSlotMs();
    msTick();
    if(msLaeuft) msPlan();
  }, Math.max(0, verzug));
}

function msStart(){
  if(msLaeuft) return;
  msLaeuft = true;
  document.getElementById("msPlay").textContent = "⏸ Pause";
  ac();                                /* Tonausgabe aufwecken */
  if(msIndex === 0 && msSlot === 0) msVor = msPat.slots.length;
  msNaechster = performance.now() + msSlotMs();
  msPlan();
}
function msPause(){
  msLaeuft = false;
  if(msTimer){ clearTimeout(msTimer); msTimer = null; }
  var b = document.getElementById("msPlay");
  if(b) b.textContent = "▶ Weiter";
}
function msNeu(){
  msPause();
  msIndex = 0; msSlot = 0; msVor = 0;
  document.getElementById("msPlay").textContent = "▶ Start";
  msZeichnen(); msSlotZeigen();
}
function msFertig(){
  msPause();
  msIndex = 0; msSlot = 0;
  document.getElementById("msAbschnitt").textContent = "Durch! Noch einmal?";
  document.getElementById("msPlay").textContent = "▶ Start";
}

function msOeffnen(id){
  var song = SONGS.filter(function(s){ return s.id === id; })[0];
  if(!song) return;
  msSong = song;
  msAufbauen(song);
  if(!msTakte.length) return;

  document.getElementById("msTitel").textContent = song.t;
  msZaehlwerk();
  msIndex = 0; msSlot = 0; msVor = 0; msLaeuft = false;
  document.getElementById("msPlay").textContent = "▶ Start";
  msTempoAnzeigen();
  document.querySelectorAll("#msSilbenWahl .segbtn").forEach(function(b){
    b.classList.toggle("on", (b.dataset.silben === "an") === msSilbenModus);
  });
  msZeichnen(); msSlotZeigen();

  var w = document.getElementById("mitspiel");
  w.hidden = false;
  document.body.classList.add("ms-offen");
}
function msSchliessen(){
  msPause();
  var w = document.getElementById("mitspiel");
  if(w) w.hidden = true;
  document.body.classList.remove("ms-offen");
}

function msTempoAnzeigen(){
  var bpm = Math.round(msBpm(msSong, msPat) * (msTempo / 100));
  var el = document.getElementById("msTempoWert");
  if(el) el.textContent = msTempo + " % · " + bpm + " bpm";
}

/* ---------- Bedienung ---------- */
document.addEventListener("click", function(e){
  var auf = e.target.closest ? e.target.closest("[data-mitspiel]") : null;
  if(auf){ e.preventDefault(); msOeffnen(auf.dataset.mitspiel); return; }
  if(e.target.id === "msZu"){ msSchliessen(); return; }
  if(e.target.id === "msPlay"){ msLaeuft ? msPause() : msStart(); return; }
  if(e.target.id === "msNeu"){ msNeu(); return; }
});
document.addEventListener("click", function(e){
  var sb = e.target.closest ? e.target.closest("#msSilbenWahl .segbtn") : null;
  if(!sb) return;
  msSilbenModus = (sb.dataset.silben === "an");
  if(typeof store === "function") store("uke.mssilben", msSilbenModus ? "an" : "aus");
  document.querySelectorAll("#msSilbenWahl .segbtn").forEach(function(b){
    b.classList.toggle("on", (b.dataset.silben === "an") === msSilbenModus);
  });
  msZeichnen(); msSilbenZeigen();
});
document.addEventListener("input", function(e){
  if(e.target.id !== "msTempo") return;
  msTempo = parseInt(e.target.value, 10);
  msTempoAnzeigen();
  if(msLaeuft){                        /* im Lauf neu takten */
    clearTimeout(msTimer);
    msNaechster = performance.now() + msSlotMs();
    msPlan();
  }
});
document.addEventListener("keydown", function(e){
  var w = document.getElementById("mitspiel");
  if(!w || w.hidden) return;
  if(e.key === "Escape"){ msSchliessen(); }
  if(e.key === " " || e.code === "Space"){ e.preventDefault(); msLaeuft ? msPause() : msStart(); }
});
document.addEventListener("visibilitychange", function(){
  if(document.hidden && msLaeuft) msPause();
});
</script>
