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

/* ---------- Lieder ---------- */
var host = document.getElementById("songlist");
var XP = {};

function chip(name){
  return '<button class="chip" data-chord="'+esc(name)+'">'+esc(name)+'</button>';
}

function songHTML(s){
  var n = XP[s.id] || 0;
  var tx = function(c){ return transposeChord(c, n); };
  var lineNo = 0;
  var badges = '<span class="badge lvl">Stufe '+s.lvl+'</span>'
    + (s.star ? '<span class="badge star">★ Wunschlied</span>' : '')
    + (s.verified ? '<span class="badge ok">geprüft</span>' : '')
    + (s.pd ? '<span class="badge">Text gemeinfrei</span>' : '');

  var secs = s.secs.map(function(sec, si){
    var rows = sec.rows.map(function(r, ri){
      lineNo++;
      var bars = r.b.map(function(c){
        return '<div class="bar">' + (c === "" ? '<span class="hold">·</span>' : chip(tx(c))) + '</div>';
      }).join("");
      var body;
      if(r.x){
        body = '<div class="line pd">'+esc(r.x)+'</div>';
      } else {
        var key = "uke.lyric."+s.id+"."+si+"."+ri;
        var val = load(key) || "";
        body = '<div class="line"><span class="rowlabel">'+lineNo+'</span>'
          + '<input type="text" data-k="'+key+'" value="'+esc(val)+'" '
          + 'placeholder="Textzeile '+lineNo+' hier eintragen" aria-label="Textzeile '+lineNo+'"></div>';
      }
      return '<div class="row"><div class="bars">'+bars+'</div>'+body+'</div>';
    }).join("");
    return '<div class="sec"><div class="sec-name">'+esc(sec.n)+'</div>'+rows+'</div>';
  }).join("");

  var src = s.src ? '<div class="song-src">Quelle: '
    + s.src.map(function(q){ return esc(q.t)+' — <a href="'+esc(q.u)+'" target="_blank" rel="noopener">Chart</a>'; }).join(" · ")
    + '</div>' : '';

  return '<article class="song" id="s-'+s.id+'" data-lvl="'+s.lvl+'" data-star="'+(s.star?1:0)+'">'
    + '<div class="song-head">'
      + '<div class="song-title"><div><h3>'+esc(s.t)+'</h3><div class="song-sub">'+esc(s.sub)+'</div></div>'
      + '<div class="badges">'+badges+'</div></div>'
      + '<div class="song-meta">'
        + '<div><b>Tonart</b>'+esc(transposeChord(s.key.replace(/m$/,""), n)) + (/m$/.test(s.key)?"m":"") +'</div>'
        + '<div><b>Schlagmuster</b>'+esc(s.strum)+'</div>'
        + '<div><b>Tempo</b>'+esc(s.tempo)+'</div>'
        + '<div class="xpose"><b style="margin:0 .4rem 0 0">Transponieren</b>'
          + '<button class="btn sq" data-x="-1" aria-label="einen Halbton tiefer">−</button>'
          + '<span class="val">'+(n>0?"+"+n:n)+'</span>'
          + '<button class="btn sq" data-x="1" aria-label="einen Halbton höher">+</button>'
          + '<button class="btn sq" data-x="0">0</button></div>'
      + '</div>'
    + '</div>'
    + '<div class="song-chords">' + s.chords.map(function(c){
        var name = tx(c);
        return '<div class="chordcard" style="width:88px"><div class="cname">'+esc(name)+'</div>'+chordSVG(name,1.1)+'</div>';
      }).join("") + '</div>'
    + '<div class="song-body">'+secs
      + (s.note ? '<div class="song-note">'+s.note+'</div>' : '') + src
    + '</div></article>';
}

function renderSongs(){
  host.innerHTML = SONGS.map(songHTML).join("");
}
function renderOne(s){
  var old = document.getElementById("s-"+s.id);
  if(!old) return;
  var tmp = document.createElement("div");
  tmp.innerHTML = songHTML(s);
  old.replaceWith(tmp.firstChild);
}
renderSongs();

/* Transponieren + Textfelder */
host.addEventListener("click", function(e){
  var b = e.target.closest("button[data-x]"); if(!b) return;
  var art = b.closest(".song");
  var id = art.id.replace(/^s-/, "");
  var s = SONGS.filter(function(z){ return z.id === id; })[0];
  var d = parseInt(b.dataset.x, 10);
  XP[id] = d === 0 ? 0 : Math.max(-6, Math.min(6, (XP[id] || 0) + d));
  renderOne(s);
});
host.addEventListener("input", function(e){
  if(e.target.matches("input[data-k]")) store(e.target.dataset.k, e.target.value);
});

/* Filter */
document.getElementById("filters").addEventListener("click", function(e){
  var b = e.target.closest("button[data-lvl]"); if(!b) return;
  this.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); });
  b.classList.add("on");
  var v = b.dataset.lvl;
  host.querySelectorAll(".song").forEach(function(a){
    var show = v === "0" || (v === "star" ? a.dataset.star === "1" : a.dataset.lvl === v);
    a.style.display = show ? "" : "none";
  });
});

/* Lieder ins Inhaltsverzeichnis */
document.getElementById("tocSongs").innerHTML = SONGS.map(function(s){
  return '<a href="#s-'+s.id+'"><span class="num">'+s.lvl+'</span>'+esc(s.t)+(s.star?' ★':'')+'</a>';
}).join("");

/* ---------- 8-Wochen-Plan ---------- */
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

document.getElementById("planlist").innerHTML = PLAN.map(function(p){
  var tasks = p.t.map(function(t, i){
    var k = "uke.plan."+p.w+"."+i;
    var on = load(k) === "1";
    return '<label class="task'+(on?" done":"")+'"><input type="checkbox" data-k="'+k+'"'+(on?" checked":"")+'>'
      + '<span>'+esc(t)+'</span></label>';
  }).join("");
  return '<div class="week"><div class="wno">'+p.w+'<small>Woche</small></div>'
    + '<div><h4>'+esc(p.h)+'</h4>'+tasks+'</div></div>';
}).join("");

document.getElementById("planlist").addEventListener("change", function(e){
  if(!e.target.matches("input[type=checkbox]")) return;
  store(e.target.dataset.k, e.target.checked ? "1" : "0");
  e.target.closest(".task").classList.toggle("done", e.target.checked);
});
</script>
