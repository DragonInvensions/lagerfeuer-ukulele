<script>
"use strict";

/* ---------- Statische Griffbild-Raster ---------- */
document.querySelectorAll(".chordgrid").forEach(function(g){
  g.innerHTML = g.dataset.chords.split(",").map(function(n){ return chordCard(n.trim()); }).join("");
});
document.getElementById("demoChord").innerHTML =
  '<div style="text-align:center">' + chordSVG("G", 2.4)
  + '<div style="font-family:var(--f-mono);font-weight:700;color:var(--accent);margin-top:.4rem">G-Dur</div>'
  + '<div style="font-family:var(--f-ui);font-size:.72rem;color:var(--ink-faint);margin-top:.2rem">'
  + 'g leer · C 2. Bund (1) · E 3. Bund (3) · A 2. Bund (2)</div></div>';

renderPatterns();

/* ==========================================================
   LIEDER
   ========================================================== */
var XP = {};                                   // Transposition je Lied
function chip(name){ return '<button class="chip" data-chord="'+esc(name)+'">'+esc(name)+'</button>'; }
/* Akkord-ueber-Silbe: "Häns[C]chen klein" -> Akkord steht ueber "chen".
   Zerlegt in Woerter, damit der Umbruch am Handy sauber bleibt. */
function chordText(str, tx){
  if(!str) return "";
  var teile = String(str).split(/(\[[^\]]*\])/);
  var html = "", offen = null;
  teile.forEach(function(p){
    if(!p) return;
    if(p.charAt(0) === "[" && p.slice(-1) === "]"){ offen = p.slice(1, -1); return; }
    p.split(/(\s+)/).forEach(function(w){
      if(w === "") return;
      if(/^\s+$/.test(w)){ html += '<span class="cw"><span class="cw-c"></span><span class="cw-t"> </span></span>'; return; }
      html += '<span class="cw"><span class="cw-c">'
            + (offen !== null ? chip(tx(offen)) : "")
            + '</span><span class="cw-t">' + esc(w) + '</span></span>';
      offen = null;
    });
  });
  return html;
}

function songById(id){ for(var i=0;i<SONGS.length;i++){ if(SONGS[i].id===id) return SONGS[i]; } return null; }
function lyricKey(id, si, ri){ return "uke.lyric."+id+"."+si+"."+ri; }

/* Texte aus der Datei texte.json (falls vorhanden) als Unterlage.
   Was im Browser getippt wurde, hat immer Vorrang. */
var DATEI = {};
function lyricGet(id, si, ri){
  var v = load(lyricKey(id, si, ri));
  if(v !== null && v !== "") return v;
  var s = DATEI[id];
  return (s && s[si+"."+ri]) || "";
}

/* Wie viele Textzeilen hat das Lied, und wie viele sind schon ausgefuellt? */
function lyricStats(s){
  var noetig = 0, da = 0;
  s.secs.forEach(function(sec, si){
    sec.rows.forEach(function(r, ri){
      if(r.x) return;                          // gemeinfreier Text steht schon da
      noetig++;
      if(lyricGet(s.id, si, ri).trim()) da++;
    });
  });
  return {noetig:noetig, da:da};
}

/* ---------- Kompakte Karte fuer die Liederliste ---------- */
function songCardHTML(s){
  var st = lyricStats(s);
  var fort = st.noetig ? '<span class="pill">'+st.da+'/'+st.noetig+' Zeilen</span>' : '';
  return '<a class="scard" href="#/lied/'+s.id+'" data-lvl="'+s.lvl+'" data-star="'+(s.star?1:0)+'"'
    + ' data-such="'+esc((s.t+" "+s.sub+" "+s.chords.join(" ")+" "+s.key).toLowerCase())+'">'
    + '<span class="scard-lvl">'+s.lvl+'</span>'
    + '<span class="scard-main">'
      + '<span class="scard-t">'+esc(s.t)+(s.star?' <b class="star">★</b>':'')+'</span>'
      + '<span class="scard-s">'+esc(s.sub)+'</span>'
      + '<span class="scard-c">'+s.chords.map(esc).join(' · ')+'</span>'
    + '</span>'
    + '<span class="scard-right">'+fort+'<span class="chev">›</span></span>'
    + '</a>';
}

function renderSongList(){
  document.getElementById("songlist").innerHTML = SONGS.map(songCardHTML).join("");
  applyFilter();
}

/* ---------- Filter und Suche ---------- */
var aktLvl = "0";
function applyFilter(){
  var q = (document.getElementById("songSearch").value || "").trim().toLowerCase();
  var treffer = 0;
  document.querySelectorAll("#songlist .scard").forEach(function(a){
    var stufeOk = aktLvl === "0" || (aktLvl === "star" ? a.dataset.star === "1" : a.dataset.lvl === aktLvl);
    var suchOk  = !q || a.dataset.such.indexOf(q) !== -1;
    var zeig = stufeOk && suchOk;
    a.style.display = zeig ? "" : "none";
    if(zeig) treffer++;
  });
  document.getElementById("noHits").hidden = treffer > 0;
}
document.getElementById("filters").addEventListener("click", function(e){
  var b = e.target.closest("button[data-lvl]"); if(!b) return;
  this.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
  b.classList.add("on"); aktLvl = b.dataset.lvl; applyFilter();
});
document.getElementById("songSearch").addEventListener("input", applyFilter);

/* ---------- Die einzelne Liedseite ---------- */
function songPageHTML(s){
  var n = XP[s.id] || 0;
  var tx = function(c){ return transposeChord(c, n); };
  var zeile = 0;

  var badges = '<span class="badge lvl">Stufe '+s.lvl+'</span>'
    + (s.star ? '<span class="badge star">★ Wunschlied</span>' : '')
    + (s.verified ? '<span class="badge ok">geprüft</span>' : '')
    + (s.pd ? '<span class="badge">Text gemeinfrei</span>' : '');

  var secs = s.secs.map(function(sec, si){
    var rows = sec.rows.map(function(r, ri){
      zeile++;
      var bars = r.b.map(function(c){
        return '<div class="bar">' + (c === "" ? '<span class="hold">·</span>' : chip(tx(c))) + '</div>';
      }).join("");
      var body;
      if(r.x){
        body = '<div class="line pd"><div class="lyr">'+chordText(r.x, tx)+'</div></div>';
      } else {
        var k = lyricKey(s.id, si, ri);
        var wert = lyricGet(s.id, si, ri);
        var hier = r.b.filter(function(c){ return c; })
                      .filter(function(c, i, a){ return a.indexOf(c) === i; });
        body = '<div class="line editable'+(wert ? '' : ' editing')+'">'
          + '<span class="rowlabel">'+zeile+'</span>'
          + '<div class="lyrwrap">'
          +   '<div class="lyr">'+chordText(wert, tx)+'</div>'
          +   '<input type="text" data-k="'+k+'" value="'+esc(wert)+'" '
          +   'placeholder="Textzeile '+zeile+'" aria-label="Textzeile '+zeile+'">'
          +   '<div class="inschips"><span class="insl">Akkord an den Cursor:</span>'
          +   hier.map(function(c){
                return '<button class="insch" data-ins="'+esc(c)+'">'+esc(tx(c))+'</button>'; }).join("")
          +   '</div>'
          + '</div>'
          + '<button class="editbtn" aria-label="Zeile bearbeiten" title="Zeile bearbeiten">✎</button>'
          + '</div>';
      }
      return '<div class="row"><div class="bars">'+bars+'</div>'+body+'</div>';
    }).join("");
    return '<div class="sec"><div class="sec-name">'+esc(sec.n)+'</div>'+rows+'</div>';
  }).join("");

  /* Schlagmuster als Grafik */
  var pat = patternByName(s.strum);
  var patHTML = pat ? patternBoxHTML(pat, true, s.tempo)
    : '<div class="song-note">Schlagmuster: '+esc(s.strum)+'</div>';

  /* Textwerkzeug nur, wenn es ueberhaupt einzutragende Zeilen gibt */
  var st = lyricStats(s);
  var textTool = "";
  if(st.noetig){
    var q = encodeURIComponent(s.textsuche || s.t);
    textTool = '<div class="lyrbar">'
      + '<div class="lyrbar-txt"><b>Liedtext</b> — '
        + (st.da ? st.da+' von '+st.noetig+' Zeilen eingetragen' : st.noetig+' Zeilen noch leer')
        + '<span class="lyrbar-q">Text finden bei '
        + '<a href="https://genius.com/search?q='+q+'" target="_blank" rel="noopener">Genius</a> · '
        + '<a href="https://www.musixmatch.com/de/search/'+q+'" target="_blank" rel="noopener">Musixmatch</a>'
        + (s.texthinweis ? ' — <em>'+esc(s.texthinweis)+'</em>' : '')
        + '</span>'
      + '</div>'
      + '<div class="lyrbar-btns">'
        + '<button class="btn on" data-paste="'+s.id+'">Text einfügen</button>'
        + (st.da ? '<button class="btn" data-clear="'+s.id+'">Leeren</button>' : '')
      + '</div></div>';
  }

  var src = s.src ? '<div class="song-src">Quelle: '
    + s.src.map(function(q){ return esc(q.t)+' — <a href="'+esc(q.u)+'" target="_blank" rel="noopener">Chart</a>'; }).join(" · ")
    + '</div>' : '';

  var idx = SONGS.indexOf(s);
  var nav = '<div class="songnav">'
    + (idx > 0 ? '<a href="#/lied/'+SONGS[idx-1].id+'">‹ '+esc(SONGS[idx-1].t)+'</a>' : '<span></span>')
    + (idx < SONGS.length-1 ? '<a href="#/lied/'+SONGS[idx+1].id+'">'+esc(SONGS[idx+1].t)+' ›</a>' : '<span></span>')
    + '</div>';

  return '<article class="song" id="s-'+s.id+'">'
    + '<div class="song-head">'
      + '<a class="crumb" href="#/lieder">‹ Alle Lieder</a>'
      + '<div class="song-title"><div><h3>'+esc(s.t)+'</h3><div class="song-sub">'+esc(s.sub)+'</div></div></div>'
      + '<div class="badges">'+badges+'</div>'
      + '<div class="song-meta">'
        + '<div><b>Tonart</b>'+esc(transposeChord(s.key.replace(/m$/,""), n)) + (/m$/.test(s.key)?"m":"") +'</div>'
        + '<div><b>Tempo</b>'+esc(s.tempo)+'</div>'
        + '<div class="xpose"><b style="margin:0 .4rem 0 0">Transponieren</b>'
          + '<button class="btn sq" data-x="-1" aria-label="einen Halbton tiefer">−</button>'
          + '<span class="val">'+(n>0?"+"+n:n)+'</span>'
          + '<button class="btn sq" data-x="1" aria-label="einen Halbton höher">+</button>'
          + '<button class="btn sq" data-x="0" aria-label="zurück in die Ausgangstonart"'
          + ' title="zurück in die Ausgangstonart">↺</button></div>'
      + '</div>'
    + '</div>'
    + '<div class="song-chords">' + s.chords.map(function(c){
        var name = tx(c);
        return '<div class="chordcard" style="width:88px"><div class="cname">'+esc(name)+'</div>'+chordSVG(name,1.1)+'</div>';
      }).join("") + '</div>'
    + '<div class="song-strum">'+patHTML+'</div>'
    + '<div class="song-body">'+textTool+secs
      + (s.note ? '<div class="song-note">'+s.note+'</div>' : '') + src + nav
    + '</div></article>';
}

var songview = document.getElementById("songview");
var aktSong = null;
function renderSong(id){
  var s = songById(id);
  if(!s){ location.hash = "#/lieder"; return; }
  aktSong = s;
  songview.innerHTML = songPageHTML(s);
}

/* Transponieren, Textfelder, Textwerkzeug */
songview.addEventListener("click", function(e){
  var b = e.target.closest("button"); if(!b) return;
  if(b.dataset.x !== undefined){
    var d = parseInt(b.dataset.x, 10);
    XP[aktSong.id] = d === 0 ? 0 : Math.max(-6, Math.min(6, (XP[aktSong.id] || 0) + d));
    renderSong(aktSong.id);
  }
  if(b.dataset.paste){ openSheet(aktSong); }
  if(b.dataset.clear){
    if(!confirm("Alle eingetragenen Textzeilen dieses Liedes löschen?")) return;
    aktSong.secs.forEach(function(sec, si){
      sec.rows.forEach(function(r, ri){
        if(!r.x){ try{ localStorage.removeItem(lyricKey(aktSong.id, si, ri)); }catch(err){} }
      });
    });
    renderSong(aktSong.id);
  }
});
songview.addEventListener("input", function(e){
  if(e.target.matches("input[data-k]")) store(e.target.dataset.k, e.target.value);
});

/* ---------- Textzeile bearbeiten und Akkorde einsetzen ---------- */
function txAktuell(){
  var n = aktSong ? (XP[aktSong.id] || 0) : 0;
  return function(c){ return transposeChord(c, n); };
}
function zeileAnzeigen(line){
  var inp = line.querySelector("input[data-k]");
  line.querySelector(".lyr").innerHTML = chordText(inp.value, txAktuell());
  line.classList.remove("editing");
  if(!inp.value.trim()) line.classList.add("editing");   // leer bleibt im Eingabemodus
}
songview.addEventListener("click", function(e){
  /* Akkordmarke an der Cursorstelle einsetzen */
  var ins = e.target.closest(".insch");
  if(ins){
    e.preventDefault();
    var line = ins.closest(".line"), inp = line.querySelector("input[data-k]");
    var pos = inp.selectionStart === null ? inp.value.length : inp.selectionStart;
    var marke = "[" + ins.dataset.ins + "]";
    inp.value = inp.value.slice(0, pos) + marke + inp.value.slice(pos);
    store(inp.dataset.k, inp.value);
    inp.focus();
    inp.setSelectionRange(pos + marke.length, pos + marke.length);
    return;
  }
  /* In den Bearbeitungsmodus wechseln */
  var line = e.target.closest(".line.editable");
  if(line && !line.classList.contains("editing")
     && (e.target.closest(".editbtn") || e.target.closest(".lyr")) && !e.target.closest(".chip")){
    line.classList.add("editing");
    var inp = line.querySelector("input[data-k]");
    inp.focus();
    inp.setSelectionRange(inp.value.length, inp.value.length);
  }
});
songview.addEventListener("focusout", function(e){
  if(!e.target.matches("input[data-k]")) return;
  var line = e.target.closest(".line");
  /* Nicht schliessen, wenn der Fokus auf die Akkordknoepfe derselben Zeile geht */
  setTimeout(function(){
    if(line.contains(document.activeElement)) return;
    zeileAnzeigen(line);
    renderSongList();
  }, 120);
});
songview.addEventListener("keydown", function(e){
  if(e.target.matches("input[data-k]") && e.key === "Enter"){ e.target.blur(); }
});

/* ---------- Blatt: ganzen Liedtext auf einmal einfuegen ---------- */
var sheet = document.getElementById("sheet");
var sheetText = document.getElementById("sheetText");
var sheetSong = null;

function offeneZeilen(s){
  var liste = [];
  s.secs.forEach(function(sec, si){
    sec.rows.forEach(function(r, ri){ if(!r.x) liste.push({si:si, ri:ri}); });
  });
  return liste;
}
function openSheet(s){
  sheetSong = s;
  var n = offeneZeilen(s).length;
  document.getElementById("sheetTitle").textContent = "Text einfügen — " + s.t;
  document.getElementById("sheetHint").innerHTML =
    'Dieses Lied hat <b>'+n+' Textzeilen</b>. Kopier den Text von einer Quelle deiner Wahl '
    + '(Genius, Musixmatch oder die Untertitel der Originalfolge), füg ihn hier ein und tipp unten '
    + 'auf Verteilen. Leerzeilen werden übersprungen. Passt die Zahl nicht, kannst du die Zeilen '
    + 'danach einzeln nachbessern.';
  sheetText.value = "";
  zaehleSheet();
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(function(){ sheetText.focus(); }, 50);
}
function closeSheet(){ sheet.hidden = true; sheetSong = null; document.body.style.overflow = ""; }

function sheetZeilen(){
  return sheetText.value.split(/\r?\n/).map(function(z){ return z.trim(); })
    .filter(function(z){ return z.length > 0; });
}
function zaehleSheet(){
  if(!sheetSong) return;
  var soll = offeneZeilen(sheetSong).length, ist = sheetZeilen().length;
  var el = document.getElementById("sheetCount");
  el.textContent = ist + " von " + soll + " Zeilen erkannt";
  el.className = "sheet-count" + (ist === soll ? " ok" : ist > soll ? " zuviel" : "");
}
sheetText.addEventListener("input", zaehleSheet);
document.getElementById("sheetApply").addEventListener("click", function(){
  if(!sheetSong) return;
  var ziele = offeneZeilen(sheetSong), zeilen = sheetZeilen();
  ziele.forEach(function(z, i){
    if(i < zeilen.length) store(lyricKey(sheetSong.id, z.si, z.ri), zeilen[i]);
  });
  var id = sheetSong.id;
  closeSheet();
  renderSong(id);
  renderSongList();
});
document.getElementById("sheetCancel").addEventListener("click", closeSheet);
document.getElementById("sheetClose").addEventListener("click", closeSheet);
sheet.addEventListener("click", function(e){ if(e.target === sheet) closeSheet(); });
document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !sheet.hidden) closeSheet(); });

/* ---------- Sichern und Uebertragen ---------- */
function alleDaten(){
  var o = {};
  try{
    for(var i=0;i<localStorage.length;i++){
      var k = localStorage.key(i);
      if(k && k.indexOf("uke.") === 0 && k !== "uke.theme" && k !== "uke.size") o[k] = localStorage.getItem(k);
    }
  }catch(e){}
  return o;
}
var sicherBox = document.getElementById("sicherBox");
var sicherInfo = document.getElementById("sicherInfo");
document.getElementById("expBtn").addEventListener("click", function(){
  var o = alleDaten();
  sicherBox.hidden = false;
  sicherBox.value = JSON.stringify(o);
  sicherBox.select();
  var texte = Object.keys(o).filter(function(k){ return k.indexOf("uke.lyric.") === 0; }).length;
  sicherInfo.textContent = texte + " Textzeilen gesichert — jetzt kopieren";
  if(navigator.clipboard){
    navigator.clipboard.writeText(sicherBox.value).then(function(){
      sicherInfo.textContent = texte + " Textzeilen in die Zwischenablage kopiert";
    }).catch(function(){});
  }
});
/* texte.json erzeugen: {liedId:{"abschnitt.zeile":"Text"}} */
document.getElementById("jsonBtn").addEventListener("click", function(){
  var out = {}, n = 0;
  SONGS.forEach(function(s){
    var eintrag = {};
    s.secs.forEach(function(sec, si){
      sec.rows.forEach(function(r, ri){
        if(r.x) return;
        var v = (load(lyricKey(s.id, si, ri)) || "").trim();
        if(v){ eintrag[si+"."+ri] = v; n++; }
      });
    });
    if(Object.keys(eintrag).length) out[s.id] = eintrag;
  });
  var box = document.getElementById("jsonBox"), info = document.getElementById("jsonInfo");
  box.hidden = false;
  box.value = JSON.stringify(out, null, 2);
  box.select();
  if(!n){
    info.textContent = "Noch keine Textzeilen eingetragen.";
    return;
  }
  info.textContent = n + " Zeilen aus " + Object.keys(out).length + " Liedern — als texte.json speichern";
  if(navigator.clipboard){
    navigator.clipboard.writeText(box.value).then(function(){
      info.textContent = n + " Zeilen kopiert — jetzt als texte.json speichern";
    }).catch(function(){});
  }
});

document.getElementById("impBtn").addEventListener("click", function(){
  if(sicherBox.hidden || !sicherBox.value.trim()){
    sicherBox.hidden = false;
    sicherInfo.textContent = "Gesicherten Text oben einfügen, dann noch einmal tippen";
    sicherBox.focus();
    return;
  }
  var o;
  try{ o = JSON.parse(sicherBox.value); }
  catch(e){ sicherInfo.textContent = "Das war kein gültiger Sicherungstext."; return; }
  var n = 0;
  Object.keys(o).forEach(function(k){ if(k.indexOf("uke.") === 0){ store(k, o[k]); n++; } });
  sicherInfo.textContent = n + " Einträge übernommen.";
  renderSongList();
  if(aktSong) renderSong(aktSong.id);
  zeichnePlan();
});

/* ==========================================================
   8-WOCHEN-PLAN
   ========================================================== */
var PLAN = [
 {w:1, h:"Anfassen, stimmen, zwei Griffe", t:[
   "Stimmen üben, bis es ohne Nachdenken geht — jeden Tag vor dem Spielen",
   "Haltung: Test „linke Hand loslassen“ besteht",
   "C und Am sauber greifen, alle vier Saiten einzeln durchzupfen",
   "Wechseluhr C ↔ Am, vier Schläge pro Akkord",
   "Muster 1 (Der Wandertakt) mit lautem Mitzählen",
   "Bruder Jakob vier Runden ohne Taktschwanken",
   "Alle meine Entchen ganz durch"
 ]},
 {w:2, h:"F dazu — und der erste echte Wechsel", t:[
   "F greifen, ohne dass die C-Saite dumpf wird",
   "Wechseluhr Am ↔ F (der Mittelfinger bleibt liegen!)",
   "Wechseluhr C ↔ F — der wichtigste Wechsel überhaupt",
   "Minutentest C ↔ F: Zahl aufschreiben",
   "Hänschen klein",
   "Oh When The Saints, langsam"
 ]},
 {w:3, h:"G7, D7 und dein erstes Ziel", t:[
   "G7 und D7 greifen lernen",
   "Wechseluhr C ↔ G7, dann G7 ↔ D7",
   "Walzertakt üben: drei statt vier Schläge zählen",
   "Auftakt verstehen: „eins zwei DREI“ — und auf der Drei einsetzen",
   "★ Zum Geburtstag viel Glück auswendig — das erste Lied, das du wirklich brauchst",
   "Bolle oder Kein schöner Land als Zugabe"
 ]},
 {w:4, h:"Das Muster, das alles verändert", t:[
   "Muster 3 (Der Klassiker) ohne Ukulele auf den Oberschenkel klopfen",
   "Muster 3 auf einem einzigen Akkord, zwanzig Takte am Stück",
   "Muster 3 im Wechsel C ↔ F ohne Stolpern",
   "★ Das Lagerfeuerlied-Lied, Teil A langsam",
   "★ Teil B doppelt so schnell dranhängen",
   "Achtelmuster (Muster 2) antesten"
 ]},
 {w:5, h:"G und Em — der harte Teil", t:[
   "G greifen: die drei Finger als feste Form vorformen",
   "Em täglich dreißigmal aufsetzen und abheben (getrennt vom Spielen)",
   "Wechseluhr G ↔ D7, dann Am ↔ Em",
   "★ SpongeBob-Titelmelodie, alles Abschläge, stramm",
   "Amazing Grace im Walzertakt",
   "Minutentest wiederholen — schlägst du deine Zahl aus Woche 2?"
 ]},
 {w:6, h:"Dm und der Fünfziger-Kreis", t:[
   "Dm greifen (ist ein F plus einen Finger)",
   "Die Folge C – Am – Dm – G als Endlosschleife, bis sie von selbst läuft",
   "★ Die Hose zerrissen komplett",
   "Stand By Me — vier Akkorde, zwei Takte je Akkord",
   "I'm Yours: die vier Zauberakkorde C – G – Am – F schnell",
   "Balladenschlag (Muster 5) einführen"
 ]},
 {w:7, h:"Moll, E7 und ein Berg", t:[
   "E7 greifen — der Griff, der zurück nach Am zieht",
   "★ Pokémon: erst nur die Strophe (Am – G / Dm – C / F – E7)",
   "★ Pokémon: Refrain in zwei Hälften lernen",
   "House of the Rising Sun im Dreiertakt",
   "Zombie mit bewusster Lautstärkesteigerung",
   "Let It Be — Strophe und Refrain unterscheiden"
 ]},
 {w:8, h:"Barré, Transponieren, Lagerfeuer", t:[
   "B♭ als Trockenübung: Barré allein, alle vier Saiten klingen",
   "Aloha ʻOe mit B♭ im Refrain",
   "Transponieren üben: ein bekanntes Lied zwei Halbtöne hoch und tief spielen",
   "Riptide und Country Roads",
   "Somewhere Over The Rainbow — das Vorspiel auswendig",
   "🔥 Fünf Lieder komplett ohne Buch spielen und dabei singen",
   "🔥 Einem Menschen vorspielen, der nicht in deinem Haushalt wohnt"
 ]}
];

function planFortschritt(){
  var ges = 0, da = 0;
  PLAN.forEach(function(p){ p.t.forEach(function(_, i){
    ges++; if(load("uke.plan."+p.w+"."+i) === "1") da++;
  });});
  return {ges:ges, da:da};
}
function zeichnePlan(){
  document.getElementById("planlist").innerHTML = PLAN.map(function(p){
    var fertig = p.t.filter(function(_, i){ return load("uke.plan."+p.w+"."+i) === "1"; }).length;
    var tasks = p.t.map(function(t, i){
      var k = "uke.plan."+p.w+"."+i;
      var on = load(k) === "1";
      return '<label class="task'+(on?" done":"")+'"><input type="checkbox" data-k="'+k+'"'+(on?" checked":"")+'>'
        + '<span>'+esc(t)+'</span></label>';
    }).join("");
    return '<div class="week"><div class="wno">'+p.w+'<small>Woche</small></div>'
      + '<div><h4>'+esc(p.h)+' <span class="wcount">'+fertig+'/'+p.t.length+'</span></h4>'+tasks+'</div></div>';
  }).join("");
}
zeichnePlan();
document.getElementById("planlist").addEventListener("change", function(e){
  if(!e.target.matches("input[type=checkbox]")) return;
  store(e.target.dataset.k, e.target.checked ? "1" : "0");
  e.target.closest(".task").classList.toggle("done", e.target.checked);
  var w = e.target.dataset.k.split(".")[2];
  var box = e.target.closest(".week").querySelector(".wcount");
  var p = PLAN.filter(function(x){ return String(x.w) === w; })[0];
  box.textContent = p.t.filter(function(_, i){ return load("uke.plan."+w+"."+i) === "1"; }).length + "/" + p.t.length;
  zeichneStart();
});

/* ==========================================================
   KURSUEBERSICHT UND STARTSEITE
   ========================================================== */
var KAPITEL = [
  {id:"instrument",       n:"01", t:"Dein Instrument",        d:"Größe, Stimmung g–C–E–A, Haltung, Anschlag"},
  {id:"griffbilder",      n:"02", t:"Griffbilder lesen",      d:"Wie ein Akkorddiagramm funktioniert"},
  {id:"ersteGriffe",      n:"03", t:"Die ersten drei Griffe", d:"C, Am, F — und die Wechseluhr"},
  {id:"rhythmus",         n:"04", t:"Rhythmus",               d:"Sechs Schlagmuster zum Anhören"},
  {id:"lagerfeuergriffe", n:"05", t:"Die Lagerfeuer-Griffe",  d:"G, G7, D7, Em, A7, Dm, E7"},
  {id:"barre",            n:"06", t:"Barré & harte Griffe",   d:"B♭ und was du tust, wenn es noch nicht geht"},
  {id:"transponieren",    n:"07", t:"Tonart & Transponieren", d:"Das Lied in deine Stimmlage schieben"},
  {id:"lagerfeuer",       n:"08", t:"Am Lagerfeuer",          d:"Vorzählen, Repertoire, Instrument draußen"}
];
document.getElementById("kurslist").innerHTML = KAPITEL.map(function(k){
  return '<a class="kcard" href="#/'+k.id+'"><span class="knum">'+k.n+'</span>'
    + '<span class="kmain"><span class="kt">'+esc(k.t)+'</span><span class="kd">'+esc(k.d)+'</span></span>'
    + '<span class="chev">›</span></a>';
}).join("");

function zeichneStart(){
  var fp = planFortschritt();
  var pct = Math.round(fp.da / fp.ges * 100);
  var wunsch = SONGS.filter(function(s){ return s.star; });
  document.getElementById("startgrid").innerHTML =
      '<a class="tile wide" href="#/plan">'
    +   '<span class="tile-k">Dein Fortschritt</span>'
    +   '<span class="tile-t">'+fp.da+' von '+fp.ges+' Übungen</span>'
    +   '<span class="bar-outer"><span class="bar-in" style="width:'+pct+'%"></span></span>'
    +   '<span class="tile-d">'+(fp.da === 0 ? "Fang mit Woche 1 an — 15 Minuten reichen."
          : pct < 100 ? "Weiter geht’s im 8-Wochen-Plan." : "Durch. Jetzt spielst du.")+'</span>'
    + '</a>'
    + '<a class="tile" href="#/lieder"><span class="tile-k">Liederbuch</span>'
    +   '<span class="tile-t">'+SONGS.length+' Lieder</span>'
    +   '<span class="tile-d">Nach Stufe sortiert, durchsuchbar</span></a>'
    + '<a class="tile" href="#/kurs"><span class="tile-k">Der Kurs</span>'
    +   '<span class="tile-t">8 Kapitel</span>'
    +   '<span class="tile-d">Vom Stimmen bis zum Lagerfeuer</span></a>'
    + '<div class="tile plain"><span class="tile-k">Deine Wunschlieder</span>'
    +   '<span class="wunsch">' + wunsch.map(function(s){
          return '<a href="#/lied/'+s.id+'">'+esc(s.t)+'</a>'; }).join("")
    +   '</span></div>'
    + '<a class="tile" href="#/lexikon"><span class="tile-k">Nachschlagen</span>'
    +   '<span class="tile-t">Akkord-Lexikon</span>'
    +   '<span class="tile-d">28 Griffbilder mit Fingersatz</span></a>'
    + '<a class="tile" href="#/instrument"><span class="tile-k">Zuerst</span>'
    +   '<span class="tile-t">Stimmen</span>'
    +   '<span class="tile-d">Stimmton zum Mitstimmen eingebaut</span></a>';
}

/* Lieder ins Inhaltsverzeichnis der Schublade */
document.getElementById("tocSongs").innerHTML = SONGS.map(function(s){
  return '<a href="#/lied/'+s.id+'"><span class="num">'+s.lvl+'</span>'+esc(s.t)+(s.star?' ★':'')+'</a>';
}).join("");

/* ==========================================================
   ROUTER
   ========================================================== */
var VIEWS = {};
document.querySelectorAll(".view").forEach(function(v){ VIEWS[v.id] = v; });
var TITEL = {
  start:"", lieder:"Lieder", kurs:"Der Kurs", plan:"8-Wochen-Plan",
  lexikon:"Akkord-Lexikon", werkzeug:"Werkzeugkasten", lied:""
};
KAPITEL.forEach(function(k){ TITEL[k.id] = k.t; });

var backBtn = document.getElementById("backBtn");
var tabbar  = document.getElementById("tabbar");

function route(){
  var h = location.hash.replace(/^#\/?/, "");
  var teile = h.split("/").filter(Boolean);
  var view = teile[0] || "start";
  var arg  = teile[1];

  if(view === "lied" && arg){ renderSong(arg); }
  else if(!VIEWS[view]){ view = "start"; }

  Object.keys(VIEWS).forEach(function(id){ VIEWS[id].hidden = (id !== view); });
  stopPattern();
  stopTone();
  hidePop();

  // Zurueck-Knopf nur, wo es ein „darueber“ gibt
  var tief = (view === "lied") || KAPITEL.some(function(k){ return k.id === view; });
  backBtn.hidden = !tief;
  backBtn.dataset.to = view === "lied" ? "#/lieder" : "#/kurs";

  // Aktiven Reiter markieren
  var tab = view === "lied" ? "lieder"
          : KAPITEL.some(function(k){ return k.id === view; }) ? "kurs"
          : (view === "lexikon" || view === "werkzeug") ? "kurs" : view;
  tabbar.querySelectorAll("a").forEach(function(a){
    a.classList.toggle("on", a.dataset.tab === tab);
  });

  document.title = (view === "lied" && aktSong ? aktSong.t + " · " : "")
    + (TITEL[view] && view !== "lied" ? TITEL[view] + " · " : "") + "Lagerfeuer-Ukulele";
  window.scrollTo(0, 0);
}
backBtn.addEventListener("click", function(){ location.hash = this.dataset.to; });
window.addEventListener("hashchange", route);

renderSongList();
zeichneStart();
route();

/* texte.json laden, falls sie neben dem Buch liegt.
   Bei file:// scheitert fetch — dann bleibt es einfach bei den lokalen Texten. */
if(location.protocol !== "file:"){
  fetch("texte.json", {cache:"no-store"})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      if(!j || typeof j !== "object") return;
      DATEI = j;
      renderSongList();
      if(aktSong) renderSong(aktSong.id);
    })
    .catch(function(){ /* keine Datei da — voellig in Ordnung */ });
}
</script>
