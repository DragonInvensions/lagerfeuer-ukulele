<script>
"use strict";

/* ==========================================================
   AKKORD-DATENBANK — Ukulele, C-Stimmung (g C E A)
   frets: [g, C, E, A]   -1 = nicht spielen
   f    : Fingernummern  0 = leer
   barre: [bund, vonIndex, bisIndex]
   ========================================================== */
var CHORDS = {
  "C":     {frets:[0,0,0,3], f:[0,0,0,3], hint:"Ringfinger, 3. Bund"},
  "C7":    {frets:[0,0,0,1], f:[0,0,0,1], hint:"Zeigefinger, 1. Bund"},
  "Cm":    {frets:[0,3,3,3], f:[0,1,1,1], barre:[3,1,3], hint:"kleiner Barré"},
  "Csus4": {frets:[0,0,1,3], f:[0,0,1,3], hint:"C plus ein Finger"},
  "C#":    {frets:[1,1,1,4], f:[1,1,1,4], barre:[1,0,2]},
  "Db":    {frets:[1,1,1,4], f:[1,1,1,4], barre:[1,0,2]},
  "C#m":   {frets:[1,1,0,4], f:[1,2,0,4]},
  "C#7":   {frets:[1,1,1,2], f:[1,1,1,3], barre:[1,0,2]},
  "D":     {frets:[2,2,2,0], f:[1,2,3,0], hint:"drei Finger, 2. Bund"},
  "D7":    {frets:[2,2,2,3], f:[1,2,3,4], hint:"Kleiner auf 3. Bund A"},
  "Dm":    {frets:[2,2,1,0], f:[2,3,1,0], hint:"Zeigefinger 1. Bund E"},
  "Dm7":   {frets:[2,2,1,3], f:[2,3,1,4]},
  "D#":    {frets:[3,3,3,1], f:[3,3,3,1], barre:[3,0,2]},
  "Eb":    {frets:[3,3,3,1], f:[3,3,3,1], barre:[3,0,2], hint:"Barré im 3. Bund"},
  "Ebm":   {frets:[3,3,2,1], f:[4,3,2,1]},
  "Eb7":   {frets:[3,3,3,4], f:[1,1,1,2], barre:[3,0,2]},
  "E":     {frets:[1,4,0,2], f:[1,4,0,2], hint:"weit gestreckt"},
  "E7":    {frets:[1,2,0,2], f:[1,2,0,3], hint:"E-Saite bleibt leer"},
  "Em":    {frets:[0,4,3,2], f:[0,3,2,1], hint:"gestaffelt: 2–3–4"},
  "F":     {frets:[2,0,1,0], f:[2,0,1,0], hint:"zwei Finger"},
  "F7":    {frets:[2,3,1,3], f:[2,3,1,4]},
  "Fm":    {frets:[1,0,1,3], f:[1,0,2,4]},
  "Fmaj7": {frets:[2,4,1,0], f:[2,4,1,0]},
  "F#":    {frets:[3,1,2,1], f:[3,1,2,1]},
  "Gb":    {frets:[3,1,2,1], f:[3,1,2,1]},
  "F#m":   {frets:[2,1,2,0], f:[2,1,3,0]},
  "F#7":   {frets:[3,4,2,4], f:[2,3,1,4]},
  "G":     {frets:[0,2,3,2], f:[0,1,3,2], hint:"Dreieck"},
  "G7":    {frets:[0,2,1,2], f:[0,2,1,3], hint:"gekipptes G"},
  "Gm":    {frets:[0,2,3,1], f:[0,2,3,1]},
  "G#":    {frets:[5,3,4,3], f:[4,1,3,2]},
  "Ab":    {frets:[5,3,4,3], f:[4,1,3,2]},
  "G#m":   {frets:[4,3,4,2], f:[3,2,4,1]},
  "Abm":   {frets:[4,3,4,2], f:[3,2,4,1]},
  "Dbm":   {frets:[1,1,0,4], f:[1,2,0,4]},
  "Gbm":   {frets:[2,1,2,0], f:[2,1,3,0]},
  "Db7":   {frets:[1,1,1,2], f:[1,1,1,3], barre:[1,0,2]},
  "Gb7":   {frets:[3,4,2,4], f:[2,3,1,4]},
  "Ab7":   {frets:[1,3,2,3], f:[1,4,2,3]},
  "A":     {frets:[2,1,0,0], f:[2,1,0,0], hint:"zwei Finger"},
  "A7":    {frets:[0,1,0,0], f:[0,1,0,0], hint:"ein Finger"},
  "Am":    {frets:[2,0,0,0], f:[2,0,0,0], hint:"Mittelfinger, 2. Bund"},
  "Am7":   {frets:[0,0,0,0], f:[0,0,0,0], hint:"alles leer"},
  "A#":    {frets:[3,2,1,1], f:[3,2,1,1], barre:[1,2,3]},
  "Bb":    {frets:[3,2,1,1], f:[3,2,1,1], barre:[1,2,3], hint:"kleiner Barré"},
  "Bbm":   {frets:[3,1,1,1], f:[3,1,1,1], barre:[1,1,3]},
  "Bb7":   {frets:[1,2,1,1], f:[1,2,1,1], barre:[1,0,3]},
  "B":     {frets:[4,3,2,2], f:[4,3,1,1], barre:[2,2,3]},
  "Bm":    {frets:[4,2,2,2], f:[3,1,1,1], barre:[2,1,3], hint:"Barré im 2. Bund"},
  "B7":    {frets:[2,3,2,2], f:[1,2,1,1], barre:[2,0,3], hint:"Barré im 2. Bund"}
};

/* ---------- Griffbild als SVG ---------- */
function chordSVG(name, size){
  var c = CHORDS[name];
  var S = size || 1;
  var W = 62*S, H = 74*S, padX = 9*S, padTop = 15*S;
  var colW = (W-2*padX)/3, rowH = (H-padTop-7*S)/4;
  if(!c){
    return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+name+' (kein Griffbild)">'
      + '<text x="'+(W/2)+'" y="'+(H/2)+'" text-anchor="middle" fill="currentColor" opacity=".4" '
      + 'font-size="'+(11*S)+'" font-family="sans-serif">?</text></svg>';
  }
  var fr = c.frets, fg = c.f || [0,0,0,0];
  var played = fr.filter(function(x){return x>0;});
  var maxF = Math.max.apply(null, fr), minF = played.length ? Math.min.apply(null, played) : 1;
  var base = (maxF > 4) ? minF : 1;
  var o = [];
  o.push('<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Griffbild '+name+'">');
  // Sattel oder Bundzahl
  if(base === 1){
    o.push('<rect x="'+padX+'" y="'+(padTop-3*S)+'" width="'+(colW*3)+'" height="'+(3*S)+'" fill="currentColor"/>');
  } else {
    o.push('<text x="'+(padX+colW*3+3*S)+'" y="'+(padTop+rowH*0.7)+'" font-size="'+(8*S)+'" '
      + 'font-family="monospace" fill="currentColor" opacity=".55">'+base+'</text>');
  }
  // Bundlinien
  for(var i=0;i<=4;i++){
    o.push('<line x1="'+padX+'" y1="'+(padTop+i*rowH)+'" x2="'+(padX+colW*3)+'" y2="'+(padTop+i*rowH)
      + '" stroke="currentColor" stroke-width="'+(0.9*S)+'" opacity=".38"/>');
  }
  // Saiten
  for(var s=0;s<4;s++){
    o.push('<line x1="'+(padX+s*colW)+'" y1="'+padTop+'" x2="'+(padX+s*colW)+'" y2="'+(padTop+4*rowH)
      + '" stroke="currentColor" stroke-width="'+(0.9*S)+'" opacity=".55"/>');
  }
  // Leersaiten-Kringel
  for(var s2=0;s2<4;s2++){
    if(fr[s2]===0){
      o.push('<circle cx="'+(padX+s2*colW)+'" cy="'+(padTop-7.5*S)+'" r="'+(2.6*S)
        + '" fill="none" stroke="currentColor" stroke-width="'+(1*S)+'" opacity=".6"/>');
    }
  }
  // Barré
  if(c.barre && c.barre[0] >= base && c.barre[0] < base+4){
    var by = padTop + (c.barre[0]-base+0.5)*rowH;
    o.push('<rect x="'+(padX+c.barre[1]*colW-4*S)+'" y="'+(by-4*S)+'" width="'+((c.barre[2]-c.barre[1])*colW+8*S)
      + '" height="'+(8*S)+'" rx="'+(4*S)+'" fill="var(--accent)"/>');
  }
  // Punkte
  for(var k=0;k<4;k++){
    if(fr[k] > 0 && fr[k] >= base && fr[k] < base+4){
      var cx = padX + k*colW, cy = padTop + (fr[k]-base+0.5)*rowH;
      var inBarre = c.barre && fr[k]===c.barre[0] && k>=c.barre[1] && k<=c.barre[2];
      if(!inBarre){
        o.push('<circle cx="'+cx+'" cy="'+cy+'" r="'+(4.6*S)+'" fill="var(--accent)"/>');
      }
      if(fg[k] > 0 && !inBarre){
        o.push('<text x="'+cx+'" y="'+(cy+2.6*S)+'" text-anchor="middle" font-size="'+(6.4*S)
          + '" font-family="sans-serif" font-weight="700" fill="var(--surface)">'+fg[k]+'</text>');
      }
    }
  }
  o.push('</svg>');
  return o.join('');
}

function chordCard(name){
  var c = CHORDS[name];
  return '<div class="chordcard"><div class="cname">'+esc(name)+'</div>'+chordSVG(name,1.35)
    + (c && c.hint ? '<div class="chint">'+esc(c.hint)+'</div>' : '') + '</div>';
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

/* ---------- Transponieren ---------- */
var SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
var PRETTY = {"C#":"C#","D#":"Eb","F#":"F#","G#":"Ab","A#":"Bb"};
var PC = {"C":0,"C#":1,"DB":1,"D":2,"D#":3,"EB":3,"E":4,"FB":4,"F":5,"E#":5,
          "F#":6,"GB":6,"G":7,"G#":8,"AB":8,"A":9,"A#":10,"BB":10,"B":11,"CB":11};
function transposeChord(ch, n){
  if(!ch || !n) return ch;
  var m = /^([A-G][#b]?)(.*)$/.exec(ch);
  if(!m) return ch;
  var root = m[1], rest = m[2];
  var pc = PC[root.toUpperCase()];
  if(pc === undefined) return ch;
  var np = ((pc + n) % 12 + 12) % 12;
  var out = SHARP[np];
  if(PRETTY[out]) out = PRETTY[out];
  return out + rest;
}

/* ---------- Akkord-Popover ---------- */
var pop = document.getElementById("pop");
var popFor = null;
function showPop(el, name){
  pop.innerHTML = '<div class="cname">'+esc(name)+'</div>'+chordSVG(name,1.5);
  pop.classList.add("on"); pop.setAttribute("aria-hidden","false");
  var r = el.getBoundingClientRect();
  var vh = document.documentElement.clientHeight;
  var vw = document.documentElement.clientWidth;
  // Passt es unter den Akkord? Sonst darueber setzen — sonst waere es am
  // unteren Bildschirmrand nicht sichtbar.
  var unten = r.bottom + 6 + pop.offsetHeight <= vh - 8;
  var top = unten ? r.bottom + window.scrollY + 6
                  : r.top + window.scrollY - pop.offsetHeight - 6;
  var left = r.left + window.scrollX + r.width/2 - pop.offsetWidth/2;
  left = Math.max(8, Math.min(left, vw - pop.offsetWidth - 8));
  pop.style.top = top+"px"; pop.style.left = left+"px";
  popFor = el;
}
function hidePop(){ pop.classList.remove("on"); pop.setAttribute("aria-hidden","true"); popFor = null; }
document.addEventListener("click", function(e){
  var chip = e.target.closest ? e.target.closest(".chip") : null;
  if(chip){
    if(popFor === chip){ hidePop(); } else { showPop(chip, chip.dataset.chord || chip.textContent.trim()); }
    e.stopPropagation();
    return;
  }
  if(!e.target.closest || !e.target.closest("#pop")) hidePop();
});
document.addEventListener("keydown", function(e){ if(e.key === "Escape") hidePop(); });
window.addEventListener("scroll", function(){ if(popFor) hidePop(); }, {passive:true});

/* ---------- Audio: Klick & Stimmton ---------- */
var AC = null;
function ac(){ if(!AC){ AC = new (window.AudioContext||window.webkitAudioContext)(); } if(AC.state==="suspended") AC.resume(); return AC; }

function click(kind){
  var a = ac(), t = a.currentTime;
  var o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
  f.type = "bandpass";
  if(kind === "D"){ o.frequency.value = 210; f.frequency.value = 900; g.gain.value = 0.30; }
  else if(kind === "U"){ o.frequency.value = 330; f.frequency.value = 1500; g.gain.value = 0.16; }
  else { o.frequency.value = 130; f.frequency.value = 400; g.gain.value = 0.12; }
  o.type = "square";
  o.connect(f); f.connect(g); g.connect(a.destination);
  g.gain.setValueAtTime(g.gain.value, t);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 0.09);
  o.start(t); o.stop(t + 0.1);
}

var tuneOsc = null, tuneBtn = null;
function playTone(freq, btn){
  var a = ac();
  stopTone();
  var o = a.createOscillator(), g = a.createGain();
  o.type = "triangle"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.18, a.currentTime + 0.03);
  o.connect(g); g.connect(a.destination); o.start();
  tuneOsc = {o:o, g:g}; tuneBtn = btn; btn.classList.add("ring");
}
function stopTone(){
  if(tuneOsc){
    var a = ac();
    try{
      tuneOsc.g.gain.cancelScheduledValues(a.currentTime);
      tuneOsc.g.gain.setValueAtTime(tuneOsc.g.gain.value, a.currentTime);
      tuneOsc.g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.08);
      tuneOsc.o.stop(a.currentTime + 0.1);
    }catch(e){}
    tuneOsc = null;
  }
  if(tuneBtn){ tuneBtn.classList.remove("ring"); tuneBtn = null; }
}
document.getElementById("tuner").addEventListener("click", function(e){
  var b = e.target.closest("button"); if(!b) return;
  if(tuneBtn === b){ stopTone(); return; }
  playTone(parseFloat(b.dataset.f), b);
});

/* ---------- Schlagmuster ---------- */
var PATTERNS = [
  {id:"p1", name:"Der Wandertakt", meter:"4/4", slots:["D","-","D","-","D","-","D","-"], bpm:92,
   desc:"Nur Abschläge, einer pro Zählzeit. Damit spielst du dein erstes Lied — und es klingt vollkommen in Ordnung. Alles Weitere ist Kür."},
  {id:"p2", name:"Achtel durch",  meter:"4/4", slots:["D","U","D","U","D","U","D","U"], bpm:88,
   desc:"Runter, rauf, runter, rauf — ohne Auslassung. Der Motor für schnelle, fröhliche Lieder. Achte darauf, dass die Aufschläge leiser bleiben als die Abschläge."},
  {id:"p3", name:"Der Klassiker", meter:"4/4", slots:["D","-","D","U","-","U","D","U"], bpm:84,
   desc:"D · D U · U D U — das Standardmuster für Ukulele und Lagerfeuergitarre. Das größte Missverständnis: Die Hand pendelt bei den Pausen weiter, sie trifft die Saiten nur nicht. Wenn du dieses eine Muster kannst, kannst du drei Viertel aller Lieder."},
  {id:"p4", name:"Walzer",        meter:"3/4", slots:["D","-","D","U","D","U"], bpm:100,
   desc:"Drei Zählzeiten statt vier. Der erste Schlag ist der schwere. Brauchst du für Zum Geburtstag viel Glück und Amazing Grace."},
  {id:"p5", name:"Balladenschlag", meter:"4/4", slots:["D","-","D","U","D","-","D","U"], bpm:76,
   desc:"Ruhig und tragend, mit einem leichten Ziehen auf der Zwei und der Vier. Für alles Langsame: Let It Be, Knockin' on Heaven's Door, Country Roads."},
  {id:"p6", name:"Chunk",         meter:"4/4", slots:["D","-","x","-","D","-","x","-"], bpm:96,
   desc:"Das x ist ein Abschlag, bei dem der Handballen gleichzeitig auf die Saiten fällt — es klackt statt zu klingen. Das ist deine Snaredrum. Klingt nach Band statt nach Anfänger."}
];

function patternByName(name){
  for(var i=0;i<PATTERNS.length;i++){ if(PATTERNS[i].name === name) return PATTERNS[i]; }
  return null;
}

/* compact = Fassung fuer die Liedseite: ohne Beschreibung, mit Tempo des Liedes */
function patternBoxHTML(p, compact, bpmText){
  var beats = p.meter === "3/4" ? ["1","+","2","+","3","+"] : ["1","+","2","+","3","+","4","+"];
  var cells = p.slots.map(function(s,i){
    var glyph = s === "D" ? "↓" : s === "U" ? "↑" : s === "x" ? "✕" : "·";
    return '<div class="stroke'+(s==="-"?" rest":"")+'" data-i="'+i+'">'
      + '<span>'+glyph+'</span><span class="beat">'+beats[i]+'</span></div>';
  }).join("");
  return '<div class="patternbox'+(compact?" compact":"")+'" data-p="'+p.id+'">'
    + '<div class="ptop"><span class="pname">'+esc(p.name)+'</span>'
    + '<span class="pmeta">'+esc(bpmText || (p.meter+" · "+p.bpm+" bpm"))+'</span></div>'
    + '<div class="strum">'+cells+'</div>'
    + '<div class="pctl"><button class="btn play">▶ Abspielen</button>'
    + '<button class="btn slow">Halbes Tempo</button></div>'
    + (compact ? '' : '<p class="desc">'+esc(p.desc)+'</p>')
    + '</div>';
}

function renderPatterns(){
  document.getElementById("patterns").innerHTML =
    PATTERNS.map(function(p){ return patternBoxHTML(p, false); }).join("");
}

var timer = null, activeBox = null;
function stopPattern(){
  if(timer){ clearInterval(timer); timer = null; }
  if(activeBox){
    activeBox.querySelectorAll(".stroke").forEach(function(s){ s.classList.remove("hot"); });
    activeBox.querySelectorAll(".play").forEach(function(b){ b.textContent = "▶ Abspielen"; b.classList.remove("on"); });
    activeBox = null;
  }
}
function playPattern(box, p, mult){
  stopPattern();
  activeBox = box;
  var cells = box.querySelectorAll(".stroke");
  var btn = box.querySelector(".play");
  btn.textContent = "■ Stopp"; btn.classList.add("on");
  var i = 0, ms = (60000 / (p.bpm * mult)) / 2;
  ac();
  timer = setInterval(function(){
    cells.forEach(function(c){ c.classList.remove("hot"); });
    var s = p.slots[i];
    if(s !== "-"){ click(s); cells[i].classList.add("hot"); }
    else { cells[i].classList.add("hot"); }
    i = (i + 1) % p.slots.length;
  }, ms);
}
/* Delegiert auf das ganze Dokument, damit auch die Muster auf den Liedseiten spielen */
document.addEventListener("click", function(e){
  var box = e.target.closest ? e.target.closest(".patternbox") : null; if(!box) return;
  var p = PATTERNS.filter(function(x){ return x.id === box.dataset.p; })[0];
  if(e.target.classList.contains("play")){
    if(activeBox === box){ stopPattern(); } else { playPattern(box, p, 1); }
  }
  if(e.target.classList.contains("slow")){ playPattern(box, p, 0.5); }
});

/* ---------- Theme ---------- */
var root = document.documentElement;
try{ var savedTheme = localStorage.getItem("uke.theme"); if(savedTheme) root.setAttribute("data-theme", savedTheme); }catch(e){}
document.getElementById("themeBtn").addEventListener("click", function(){
  var cur = root.getAttribute("data-theme");
  var next = cur === "dark" ? "light" : cur === "light" ? "dark"
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark");
  root.setAttribute("data-theme", next);
  try{ localStorage.setItem("uke.theme", next); }catch(e){}
});

/* ---------- Textgroesse im Liederteil ---------- */
var SIZES = [
  {v:1,    label:"A",   name:"normal"},
  {v:1.18, label:"A+",  name:"groß"},
  {v:1.38, label:"A++", name:"sehr groß"}
];
var sizeBtn = document.getElementById("sizeBtn");
var sizeIdx = 0;
try{ var ss = parseInt(localStorage.getItem("uke.size"), 10); if(ss >= 0 && ss < SIZES.length) sizeIdx = ss; }catch(e){}
function applySize(){
  var s = SIZES[sizeIdx];
  root.style.setProperty("--songscale", s.v);
  sizeBtn.textContent = s.label;
  sizeBtn.classList.toggle("on", sizeIdx > 0);
  sizeBtn.setAttribute("aria-label", "Textgröße der Lieder: " + s.name + " — tippen zum Wechseln");
}
applySize();
sizeBtn.addEventListener("click", function(){
  sizeIdx = (sizeIdx + 1) % SIZES.length;
  applySize();
  try{ localStorage.setItem("uke.size", String(sizeIdx)); }catch(e){}
});

/* ---------- Bildschirm anlassen (Wake Lock) ---------- */
var wakeBtn = document.getElementById("wakeBtn");
if("wakeLock" in navigator){
  wakeBtn.hidden = false;
  var wakeOn = false, lock = null;
  var setWakeUI = function(){
    wakeBtn.classList.toggle("on", wakeOn);
    wakeBtn.setAttribute("aria-pressed", wakeOn ? "true" : "false");
    wakeBtn.title = wakeOn ? "Bildschirm bleibt an — tippen zum Ausschalten"
                           : "Bildschirm beim Spielen anlassen";
  };
  var acquire = function(){
    navigator.wakeLock.request("screen").then(function(l){
      lock = l;
      l.addEventListener("release", function(){ lock = null; });
    }).catch(function(){ wakeOn = false; setWakeUI(); });
  };
  wakeBtn.addEventListener("click", function(){
    wakeOn = !wakeOn;
    if(wakeOn){ acquire(); }
    else if(lock){ lock.release().catch(function(){}); lock = null; }
    setWakeUI();
  });
  // Nach Tabwechsel oder Bildschirmsperre geht die Sperre verloren — wieder holen
  document.addEventListener("visibilitychange", function(){
    if(wakeOn && lock === null && document.visibilityState === "visible") acquire();
  });
  setWakeUI();
}

/* ---------- Inhaltsverzeichnis (mobil) ---------- */
var toc = document.getElementById("toc"), scrim = document.getElementById("scrim");
function closeToc(){ toc.classList.remove("open"); scrim.classList.remove("on"); }
document.getElementById("tocBtn").addEventListener("click", function(){
  toc.classList.toggle("open"); scrim.classList.toggle("on");
});
scrim.addEventListener("click", closeToc);
toc.addEventListener("click", function(e){ if(e.target.tagName === "A") closeToc(); });

/* ---------- Speicher ---------- */
function store(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
function load(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
</script>
