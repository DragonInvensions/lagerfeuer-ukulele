<script>
"use strict";
/* ==========================================================
   LIEDER
   b: Takte. ""  = vorherigen Akkord halten.
   x: Liedtext (nur gemeinfrei) — null = Eingabefeld
   ========================================================== */
var SONGS = [

{id:"bruderjakob", t:"Bruder Jakob", sub:"Traditionell, Kanon · gemeinfrei", lvl:1, key:"C",
 chords:["C"], strum:"Der Wandertakt", tempo:"96 bpm · 4/4", pd:true, verified:true,
 note:"<b>Ein einziger Griff, das ganze Lied.</b> Das ist kein Trostpreis — dein Ziel ist, vier Runden am Stück durchzuhalten, ohne auf die Hand zu schauen und ohne dass der Takt schwankt. Wer das kann, hat die halbe Schlaghand schon gelernt. Bonus: Zu viert als Kanon, jede Stimme setzt zwei Takte später ein — die Akkorde passen trotzdem, weil es immer C bleibt.",
 secs:[{n:"Kanon", rows:[
   {b:["C","C"], x:"[C]Bru-der Ja-kob, Bru-der Ja-kob,"},
   {b:["C","C"], x:"schläfst du noch? Schläfst du noch?"},
   {b:["C","C"], x:"Hörst du nicht die Glo-cken, hörst du nicht die Glo-cken?"},
   {b:["C","C"], x:"Ding dang dong, ding dang dong."}
 ]}]},

{id:"entchen", t:"Alle meine Entchen", sub:"Traditionell · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"100 bpm · 4/4", pd:true, verified:true,
 note:"Dein erster echter Akkordwechsel. Übe zuerst nur die Stelle C → G7 und wieder zurück, zwanzigmal, bevor du das Lied spielst. Der Wechsel fällt immer auf die <b>Eins</b> des Taktes — die Finger müssen also schon während des letzten Schlags davor unterwegs sein.",
 secs:[{n:"Lied", rows:[
   {b:["C","C"],  x:"[C]Al-le mei-ne Ent-chen"},
   {b:["G7","C"], x:"[G7]schwim-men auf dem See, [C]schwim-men auf dem See,"},
   {b:["C","C"],  x:"[C]Köpf-chen in das Was-ser,"},
   {b:["G7","C"], x:"[G7]Schwänz-chen in die [C]Höh."}
 ]}]},

{id:"haenschen", t:"Hänschen klein", sub:"Traditionell · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"100 bpm · 4/4", pd:true, verified:true,
 note:"Dieselben zwei Akkorde, aber der Wechsel kommt öfter und in Zeile 3 auf einer ungewohnten Stelle. Gutes Training fürs Mitzählen: Sprich beim Spielen laut „eins zwei drei vier“ mit.",
 secs:[{n:"Lied", rows:[
   {b:["C","C","G7","C"],  x:"[C]Häns-chen klein ging al-lein [G7]in die wei-te [C]Welt hin-ein."},
   {b:["C","C","G7","C"],  x:"[C]Stock und Hut steht ihm gut, [G7]ist gar [C]wohl-ge-mut."},
   {b:["G7","C","G7","C"], x:"[G7]A-ber Mut-ter [C]wei-net sehr, [G7]hat ja nun kein [C]Häns-chen mehr!"},
   {b:["C","C","G7","C"],  x:"[C]»Wünsch dir Glück!«, sagt ihr Blick, [G7]»kehr nur bald zu-[C]rück!«"}
 ]}]},

{id:"saints", t:"Oh When The Saints", sub:"Traditional Spiritual · gemeinfrei", lvl:1, key:"C",
 chords:["C","C7","F","G7"], strum:"Der Wandertakt", tempo:"120 bpm · 4/4", pd:true, verified:true,
 note:"Der Klassiker, um F einzuführen — und ein Lied, bei dem jeder mitsingt, ohne den Text zu kennen. Das <b>C7</b> in Zeile 3 ist optional: Es ist ein C, bei dem der Zeigefinger zusätzlich auf den 1. Bund der A-Saite geht, und es zieht das Ohr in Richtung F. Lass es weg, wenn es dich aufhält.",
 secs:[{n:"Lied", rows:[
   {b:["C","C","C","C"],   x:"[C]Oh when the saints go mar-ching in,"},
   {b:["C","C","G7","G7"], x:"[C]oh when the saints go [G7]mar-ching in,"},
   {b:["C","C7","F","F"],  x:"[C]oh Lord I want to [C7]be in [F]that num-ber,"},
   {b:["C","G7","C","C"],  x:"[C]when the saints go [G7]mar-ching [C]in."}
 ]}]},

{id:"geburtstag", t:"Zum Geburtstag viel Glück", sub:"Happy Birthday to You · Hill/Hill 1893 · gemeinfrei", lvl:2, key:"C",
 chords:["C","C7","F","G7"], strum:"Walzer", tempo:"100 bpm · 3/4", pd:true, verified:true, star:true,
 note:"<b>Das nützlichste Lied der Welt.</b> Drei Dinge machen es knifflig: Erstens der <b>Walzertakt</b> — drei Schläge pro Takt, nicht vier. Zweitens der <b>Auftakt</b>: Das Wort „Zum“ kommt noch <em>vor</em> dem ersten Takt, du zählst also „eins zwei DREI“ und singst auf der Drei los. Drittens die dritte Zeile, die auf F geht — genau da singen alle falsch. Merk dir den Ablauf als Bogen: weg (G7) — zurück (C) — weg (F) — heim (C).<br><br>Für den Namen in Zeile 3 brauchst du manchmal eine Silbe mehr oder weniger. Das ist kein Problem: Bleib im Takt und quetsch die Silben rein, so macht es jeder.",
 secs:[
  {n:"Deutsch", rows:[
   {b:["C","C","G7"],  x:"[C]Zum Ge-burts-tag viel [G7]Glück,"},
   {b:["G7","G7","C"], x:"[G7]zum Ge-burts-tag viel [C]Glück,"},
   {b:["C","C7","F"],  x:"[C]zum Ge-burts-[C7]tag, lie-[F]be(r) …"},
   {b:["C","G7","C"],  x:"[C]zum Ge-burts-[G7]tag viel [C]Glück!"}
  ]},
  {n:"Englisch", rows:[
   {b:["C","C","G7"],  x:"[C]Hap-py birth-day to [G7]you,"},
   {b:["G7","G7","C"], x:"[G7]hap-py birth-day to [C]you,"},
   {b:["C","C7","F"],  x:"[C]hap-py birth-[C7]day dear [F]…"},
   {b:["C","G7","C"],  x:"[C]hap-py birth-[G7]day to [C]you!"}
  ]}
 ]},

{id:"lagerfeuerlied", textsuche:"SpongeBob Das Lagerfeuerlied Lied deutsch", texthinweis:"Die deutsche Synchronfassung heisst „Das Lagerfeuerlied-Lied“ — such danach, nicht nach dem englischen Titel.", t:"Das Lagerfeuerlied-Lied", sub:"The Campfire Song Song · SpongeBob Schwammkopf", lvl:2, key:"C",
 chords:["C","F","D7","G7"], strum:"Der Wandertakt", tempo:"116 bpm, dann doppelt · 4/4", verified:true, star:true,
 note:"<b>Der Witz des Liedes ist das Tempo.</b> Teil A spielst du gemütlich, Teil B mit exakt denselben Akkorden doppelt so schnell — und Teil C, wenn du dich traust, nochmal schneller. Nimm dir deshalb ein Ausgangstempo, das sich zu langsam anfühlt: Was du beim ersten Durchgang zu schnell ansetzt, killt dich beim zweiten.<br><br>Der Grundwechsel ist <b>C → F → C</b>, dreimal hintereinander, dann einmal <b>D7 → G7</b> als Spannungsbogen zum Schluss der Strophe. D7 ist hier der einzige neue Griff — er kommt nur an einer einzigen Stelle vor, das schaffst du.",
 src:[{t:"Akkorde abgeglichen mit UkuleleChordsSongs (Tonart C) und Scorpex Uke (Tonart G, transponiert)", u:"https://ukulelechordssongs.blogspot.com/2017/05/ukulele-chords-campfire-song-song-by-spongebob.html"}],
 secs:[
  {n:"Teil A — gemütlich", rows:[
   {b:["C","F","C","C"],    x:null},
   {b:["C","F","C","C"],    x:null},
   {b:["C","F","C","C"],    x:null},
   {b:["D7","D7","G7","G7"],x:null}
  ]},
  {n:"Teil B — doppeltes Tempo, gleiche Akkorde", rows:[
   {b:["C","F","C","C"],    x:null},
   {b:["C","F","C","C"],    x:null},
   {b:["C","F","C","C"],    x:null},
   {b:["D7","D7","G7","G7"],x:null}
  ]},
  {n:"Schluss", rows:[
   {b:["C","C","G7","C"],   x:null}
  ]}
 ]},

{id:"keinschoenerland", t:"Kein schöner Land", sub:"Zuccalmaglio 1840 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Walzer", tempo:"96 bpm · 3/4", pd:true,
 note:"Das deutsche Lagerfeuerlied schlechthin — und ein Lied, bei dem die ältere Generation garantiert einsteigt. Im Walzertakt, ruhig. Wenn du mehrstimmig singen willst: Das ist genau das Lied dafür.",
 secs:[{n:"Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Kein schö-ner [G7]Land in die-ser [C]Zeit"},
   {b:["C","G7","C"], x:"[C]als hier das [G7]uns-re weit und [C]breit,"},
   {b:["F","C","G7"], x:"[F]wo wir uns [C]fin-[G7]den"},
   {b:["F","C","G7"], x:"[F]wohl un-ter [C]Lin-[G7]den"},
   {b:["C","G7","C"], x:"[C]zur A-[G7]bend-[C]zeit."}
 ]}]},

{id:"bolle", t:"Bolle reiste jüngst zu Pfingsten", sub:"Berliner Gassenhauer · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Wandertakt", tempo:"120 bpm · 4/4", pd:true,
 note:"Zehn Strophen, alle mit derselben Melodie und demselben Akkordschema — perfekt zum Einspielen, weil du dich nach der ersten Strophe nur noch auf die Schlaghand konzentrieren musst. Der Refrain am Ende jeder Strophe ist immer gleich.",
 secs:[{n:"Strophe (Schema für alle)", rows:[
   {b:["C","C","G7","C"], x:"[C]Bol-le rei-ste jüngst zu Pfing-sten, [G7]nach Pan-kow war sein [C]Ziel,"},
   {b:["C","C","G7","C"], x:"[C]da ver-lor er sei-nen Jüng-sten, [G7]ganz Pan-kow such-te [C]viel."},
   {b:["F","C","G7","C"], x:"[F]Und Bol-le, der war [C]gar nicht lang-sam, [G7]er such-te ihn auch [C]nicht,"},
   {b:["C","C","G7","C"], x:"[C]a-ber den-noch hat sich Bol-le [G7]ganz köst-lich a-mü-[C]siert."}
 ]}]},

{id:"alohaoe", t:"Aloha ʻOe", sub:"Königin Liliʻuokalani, 1878 · gemeinfrei", lvl:3, key:"F",
 chords:["F","Bb","C7"], strum:"Der Klassiker", tempo:"84 bpm · 4/4", pd:true,
 note:"Das hawaiianische Abschiedslied, komponiert von der letzten Königin Hawaiis — und damit das einzige Lied in diesem Buch, das wirklich auf einer Ukulele erfunden wurde. Enthält deinen ersten Barré (<b>B♭</b>), aber nur an zwei Stellen im Refrain. Wenn es noch nicht geht: an der Stelle einfach F weiterspielen und beim nächsten Takt wieder einsteigen.",
 secs:[
  {n:"Strophe", rows:[
   {b:["F","F","C7","C7"], x:null},
   {b:["C7","C7","F","F"], x:null}
  ]},
  {n:"Refrain", rows:[
   {b:["F","F","Bb","Bb"], x:"[F]A-lo-ha ʻoe, [Bb]a-lo-ha ʻoe"},
   {b:["F","C7","F","F"],  x:"[F]e ke o-nao-na [C7]no-ho i ka [F]li-po"},
   {b:["F","F","Bb","Bb"], x:"[F]One fond em-brace, [Bb]a hoʻi aʻe au"},
   {b:["F","C7","F","F"],  x:"[F]un-til we [C7]meet a-[F]gain."}
  ]}
 ]},

{id:"spongebobtheme", textsuche:"SpongeBob Schwammkopf Titelsong deutsch Ananas", texthinweis:"Deutsche Fassung: die Ruf-und-Antwort-Zeilen sind kuerzer als im Original.", t:"SpongeBob-Titelmelodie", sub:"SpongeBob Schwammkopf · Titellied", lvl:3, key:"G",
 chords:["G","C","D7","A7"], strum:"Der Wandertakt", tempo:"145 bpm · 4/4", verified:true, star:true,
 note:"<b>Ruf und Antwort.</b> Du spielst die Frage, alle anderen brüllen den Namen — deshalb funktioniert das Lied am Lagerfeuer so gut, ohne dass jemand den Text können muss. Die Ansage am Anfang („Sind alle bereit?“) wird gesprochen, ohne Akkord; dann geht es stur auf Abschlägen los, straff wie ein Seemannslied. Kein Aufschlag, keine Verzierung — jeder Schlag ein Ruderschlag.<br><br>Das <b>A7</b> in der letzten Ruf-Zeile ist der Griff mit einem einzigen Finger und zieht wunderbar zum D7. Die vier Namensrufe am Ende laufen über G – C – D7 – G, also einmal quer durch die ganze Tonart.",
 src:[{t:"Akkordvorrat (G, C, D7, A7) nach UkuTabs; Anordnung als vereinfachte Ruf-und-Antwort-Begleitung", u:"https://ukutabs.com/m/misc-cartoons/spongebob-squarepants-theme/"}],
 secs:[
  {n:"Ruf & Antwort", rows:[
   {b:["G","G","C","G"],   x:null},
   {b:["G","G","D7","G"],  x:null},
   {b:["G","G","C","G"],   x:null},
   {b:["G","A7","D7","G"], x:null}
  ]},
  {n:"Name × 4", rows:[
   {b:["G","C","D7","G"],  x:null}
  ]},
  {n:"Schluss (Nasenflöte)", rows:[
   {b:["G","D7","G","G"],  x:null}
  ]}
 ]},

{id:"hosezerrissen", textsuche:"SpongeBob Ich hab die Hose mir zerrissen deutsch", texthinweis:"Deutscher Titel der Synchronfassung; die Untertitel der Folge sind die genaueste Quelle.", t:"Die Hose zerrissen", sub:"Ripped Pants · SpongeBob Schwammkopf", lvl:3, key:"C",
 chords:["C","Am","Dm","G","Em"], strum:"Der Klassiker", tempo:"72 bpm · 4/4", verified:true, star:true,
 note:"<b>Das ist in Wahrheit ein Fünfzigerjahre-Lied</b> — und genau deshalb klingt es wie am Lagerfeuer erfunden. Die Folge <b>C – Am – Dm – G</b> ist der berühmte „Fünfziger-Kreis“, das Rückgrat von tausend Doo-Wop-Balladen. Wenn du diese vier Takte im Schlaf kannst, kannst du nebenbei hunderte andere Lieder mitbegleiten.<br><br>Der einzige Sonderfall ist die dritte Zeile, wo statt C ein <b>Em</b> steht — das macht die Stelle sehnsüchtig. Tempo bewusst langsam (etwa 72), das Lied ist eine Schunkelnummer, kein Rocksong.",
 src:[{t:"Akkorde abgeglichen mit ukulele-tabs.com (Tonart C: C–Am–Dm–G, Em-Variante)", u:"https://www.ukulele-tabs.com/uke-songs/spongebob-squarepants/ripped-pants-uke-tab-13552.html"}],
 secs:[
  {n:"Strophe", rows:[
   {b:["C","Am","Dm","G"],  x:null},
   {b:["C","Am","Dm","G"],  x:null},
   {b:["Em","Am","Dm","G"], x:null},
   {b:["C","Am","Dm","G"],  x:null}
  ]},
  {n:"Refrain", rows:[
   {b:["C","Am","Dm","G"],  x:null},
   {b:["Em","Am","Dm","G"], x:null}
  ]},
  {n:"Schluss", rows:[
   {b:["C","Am","Dm","G"],  x:null},
   {b:["Dm","Dm","G","C"],  x:null}
  ]}
 ]},

{id:"pippi", textsuche:"Hey Pippi Langstrumpf Text", t:"Hey Pippi Langstrumpf", sub:"Pippi Langstrumpf · Titellied", lvl:3, key:"C",
 chords:["C","Dm","F","G"], strum:"Der Wandertakt", tempo:"132 bpm · 4/4",
 note:"Schnell, laut, ohne Rücksicht. Das <b>Dm</b> in der Strophe ist neu: Es ist ein F, bei dem zusätzlich der Ringfinger auf den 2. Bund der C-Saite geht. Der Refrain („falleri, fallera“) läuft über C – F – G – C und ist das, was alle mitsingen — den solltest du auswendig können.",
 secs:[
  {n:"Strophe", rows:[
   {b:["C","Dm","G","C"], x:null},
   {b:["C","Dm","G","C"], x:null},
   {b:["C","Dm","G","C"], x:null},
   {b:["C","Dm","G","C"], x:null}
  ]},
  {n:"Refrain", rows:[
   {b:["C","F","G","C"],  x:null},
   {b:["C","F","G","C"],  x:null}
  ]}
 ]},

{id:"bienemaja", textsuche:"Biene Maja Karel Gott Text", t:"Die Biene Maja", sub:"Karel Svoboda / Karel Gott · Titellied", lvl:3, key:"C",
 chords:["C","F","G","G7","Dm"], strum:"Der Klassiker", tempo:"120 bpm · 4/4",
 note:"Im Original steht das Lied in D-Dur; hier nach C geschoben, damit du ohne Barré auskommst. Mit dem <b>+2</b> auf dem Transponier-Knopf bist du zurück im Original — dann brauchst du D, A, G, Em, und das Lied liegt für viele Stimmen bequemer.",
 secs:[
  {n:"Strophe", rows:[
   {b:["C","C","G","C"],   x:null},
   {b:["C","C","G","C"],   x:null},
   {b:["F","C","G","C"],   x:null}
  ]},
  {n:"Refrain", rows:[
   {b:["G","C","Dm","G7"], x:null},
   {b:["C","F","G7","C"],  x:null}
  ]}
 ]},
