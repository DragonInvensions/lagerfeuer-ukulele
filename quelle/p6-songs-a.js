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
   {b:["C","C"], x:"[C]Bru-der Ja-kob, | Bru-der Ja-kob,"},
   {b:["C","C"], x:"schläfst du noch? | Schläfst du noch?"},
   {b:["C","C"], x:"Hörst du nicht die Glo-cken, | hörst du nicht die Glo-cken?"},
   {b:["C","C"], x:"Ding dang dong, | ding dang dong."}
 ]}]},

{id:"entchen", t:"Alle meine Entchen", sub:"Traditionell · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"100 bpm · 4/4", pd:true, verified:true,
 note:"Dein erster echter Akkordwechsel. Übe zuerst nur die Stelle C → G7 und wieder zurück, zwanzigmal, bevor du das Lied spielst. Der Wechsel fällt immer auf die <b>Eins</b> des Taktes — die Finger müssen also schon während des letzten Schlags davor unterwegs sein.",
 secs:[{n:"1. Strophe", rows:[
   {b:["C","C"],  x:"[C]Al-le mei-ne | Ent-chen"},
   {b:["G7","C"], x:"[G7]schwim-men auf dem See, | [C]schwim-men auf dem See,"},
   {b:["C","C"],  x:"[C]Köpf-chen in das | Was-ser,"},
   {b:["G7","C"], x:"[G7]Schwänz-chen in die | [C]Höh."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C",""],   x:"[C]Al-le mei-ne | Täub-chen"},
   {b:["G7","C"], x:"[G7]gur-ren auf dem Dach, | [C]gur-ren auf dem Dach,"},
   {b:["C",""],   x:"[C]eins fliegt in die | Lüf-te,"},
   {b:["G7","C"], x:"[G7]al-le flie-gen | [C]nach."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C",""],   x:"[C]Al-le mei-ne | Hüh-ner"},
   {b:["G7","C"], x:"[G7]schar-ren in dem Stroh, | [C]schar-ren in dem Stroh,"},
   {b:["C",""],   x:"[C]fin-den sie ein | Körn-chen,"},
   {b:["G7","C"], x:"[G7]sind sie al-le | [C]froh."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C",""],   x:"[C]Al-le mei-ne | Gäns-chen"},
   {b:["G7","C"], x:"[G7]wat-scheln durch den Grund, | [C]wat-scheln durch den Grund,"},
   {b:["C",""],   x:"[C]su-chen in dem | Tüm-pel,"},
   {b:["G7","C"], x:"[G7]wer-den ku-gel- | [C]rund."}
  ]}
 ]},

{id:"haenschen", t:"Hänschen klein", sub:"Traditionell · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"100 bpm · 4/4", pd:true, verified:true,
 note:"Dieselben zwei Akkorde, aber der Wechsel kommt öfter und in Zeile 3 auf einer ungewohnten Stelle. Gutes Training fürs Mitzählen: Sprich beim Spielen laut „eins zwei drei vier“ mit.",
 secs:[{n:"1. Strophe", rows:[
   {b:["C","C","G7","C"],  x:"[C]Häns-chen klein | ging al-lein | [G7]in die wei-te | [C]Welt hin-ein."},
   {b:["C","C","G7","C"],  x:"[C]Stock und Hut | steht ihm gut, | [G7]ist gar | [C]wohl-ge-mut."},
   {b:["G7","C","G7","C"], x:"[G7]A-ber Mut-ter | [C]wei-net sehr, | [G7]hat ja nun kein | [C]Häns-chen mehr!"},
   {b:["C","C","G7","C"],  x:"[C]»Wünsch dir Glück!«, | sagt ihr Blick, | [G7]»kehr nur bald | zu-[C]rück!«"}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","","G7","C"],   x:"[C]Sie-ben Jahr, | trüb und klar, | [G7]Häns-chen in der | [C]Frem-de war."},
   {b:["C","","G7","C"],   x:"[C]Da be-sinnt | sich das Kind, | [G7]ei-let heim | [C]ge-schwind."},
   {b:["G7","C","G7","C"], x:"[G7]Doch nun ist's kein | [C]Häns-chen mehr, | [G7]nein, ein gro-ßer | [C]Hans ist er."},
   {b:["C","","G7","C"],   x:"[C]Stirn und Hand | braun-ge-brannt, | [G7]wird er wohl | er-[C]kannt?"}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","","G7","C"],   x:"[C]Ein, zwei, drei | gehn vor-bei, | [G7]wis-sen nicht, wer | [C]das wohl sei."},
   {b:["C","","G7","C"],   x:"[C]Schwes-ter spricht: | »Welch Ge-sicht!«, | [G7]kennt den Bru- | [C]der nicht."},
   {b:["G7","C","G7","C"], x:"[G7]Kommt da-her die | [C]Mut-ter sein, | [G7]schaut ihm kaum ins | [C]Aug hin-ein,"},
   {b:["C","","G7","C"],   x:"[C]ruft sie schon: | »Hans, mein Sohn! | [G7]Grüß dich, Hans, | mein [C]Sohn!«"}
  ]}
 ]},

{id:"saints", t:"Oh When The Saints", sub:"Traditional Spiritual · gemeinfrei", lvl:1, key:"C",
 chords:["C","C7","F","G7"], strum:"Der Wandertakt", tempo:"120 bpm · 4/4", pd:true, verified:true,
 note:"Der Klassiker, um F einzuführen — und ein Lied, bei dem jeder mitsingt, ohne den Text zu kennen. Das <b>C7</b> in Zeile 3 ist optional: Es ist ein C, bei dem der Zeigefinger zusätzlich auf den 1. Bund der A-Saite geht, und es zieht das Ohr in Richtung F. Lass es weg, wenn es dich aufhält.",
 secs:[{n:"Lied", rows:[
   {b:["C","C","C","C"],   x:"[C]Oh when the | saints go mar-ching | in, |"},
   {b:["C","C","G7","G7"], x:"[C]oh when the | saints go | [G7]mar-ching | in,"},
   {b:["C","C7","F","F"],  x:"[C]oh Lord I want to | [C7]be in | [F]that num-ber, |"},
   {b:["C","G7","C","C"],  x:"[C]when the saints go | [G7]mar-ching | [C]in. |"}
 ]}]},

{id:"vogelhochzeit", t:"Die Vogelhochzeit", sub:"Volkslied, Text um 1470 / Melodie Schlesien, 19. Jh. · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"116 bpm · 4/4", pd:true, verified:true,
 note:"<b>Zwei Akkorde, unendlich viele Strophen</b> — das perfekte Lagerfeuerlied für eine Runde, in der nicht alle textsicher sind: Den Refrain „Fiderallala“ kann nach einer Strophe jeder mitsingen. Original im 2/4-Takt. Je zwei davon sind hier zu einem 4/4-Takt zusammengefasst, damit ein normales Schlagmuster durchläuft: <b>eine Zeile = ein Takt</b>, jedes Kästchen eine halbe Zeile. Nur die Schlusszeile des Refrains hält durchgehend C — deshalb ein einziges Kästchen über die volle Breite. Der Wechsel C → G7 fällt immer auf dieselbe Stelle, Strophe für Strophe — genau deshalb ist es so gutes Trainingsmaterial.<br><br><b>Weitere Strophen</b> (gleiches Schema): Die Drossel war der Bräutigam, die Amsel war die Braute. · Der Sperber, der Sperber, der war der Hochzeitswerber. · Die Lerche, die Lerche, die führt die Braut zur Kerche. · Der Auerhahn, der Auerhahn, der war der stolze Herr Kaplan. · Die Meise, die Meise, die bringt der Braut die Speise. · Der Kuckuck schreit, der Kuckuck schreit, er bringt der Braut das Hochzeitskleid. · Der Uhu, der Uhu, der bringt der Braut die Hochzeitsschuh. · Nun ist die Vogelhochzeit aus, und alle ziehn vergnügt nach Haus.",
 src:[{t:"Notenbeispiel (G-Dur, 2/4, Auftakt Achtel) und Herkunft — Wikipedia", u:"https://de.wikipedia.org/wiki/Die_Vogelhochzeit"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/e-songs-lieder/ein-vogel-wollte-hochzeit-machen/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C","G7"],      x:"Ein | [C]Vo-gel woll-te | [G7]Hoch-zeit ma-chen"},
   {b:["G7","C"],      x:"[G7]in dem grü-nen | [C]Wal-de."},
   {b:["C","G7"],      x:"[C]Fi-de-ral-la-la, | [G7]fi-de-ral-la-la,"},
   {b:["C",""],        x:"[C]fi-de-ral-la-la- | la-la."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","G7"], x:"Die | [C]Dros-sel war der | [G7]Bräu-ti-gam,"},
   {b:["G7","C"], x:"[G7]die Am-sel war die | [C]Brau-te."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","G7"], x:"Der | [C]Sper-ber, der | [G7]Sper-ber,"},
   {b:["G7","C"], x:"[G7]der war der Hoch-zeits- | [C]wer-ber."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","G7"], x:"Die | [C]Ler-che, die | [G7]Ler-che,"},
   {b:["G7","C"], x:"[G7]die führt die Braut zur | [C]Ker-che."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C","G7"], x:"Der | [C]Au-er-hahn, der | [G7]Au-er-hahn,"},
   {b:["G7","C"], x:"[G7]der war der stol-ze | [C]Herr Ka-plan."}
  ]},
  {n:"6. Strophe", rows:[
   {b:["C","G7"], x:"Die | [C]Mei-se, die | [G7]Mei-se,"},
   {b:["G7","C"], x:"[G7]die bringt der Braut die | [C]Spei-se."}
  ]},
  {n:"7. Strophe", rows:[
   {b:["C","G7"], x:"Der | [C]Ku-ckuck schreit, der | [G7]Ku-ckuck schreit,"},
   {b:["G7","C"], x:"[G7]er bringt der Braut das | [C]Hoch-zeits-kleid."}
  ]},
  {n:"8. Strophe", rows:[
   {b:["C","G7"], x:"Nun | [C]ist die Vo-gel- | [G7]hoch-zeit aus,"},
   {b:["G7","C"], x:"[G7]und al-le ziehn ver- | [C]gnügt nach Haus."}
  ]}
 ]},

{id:"geburtstag", t:"Zum Geburtstag viel Glück", sub:"Happy Birthday to You · Hill/Hill 1893 · gemeinfrei", lvl:2, key:"C",
 chords:["C","C7","F","G7"], strum:"Walzer", tempo:"100 bpm · 3/4", pd:true, verified:true, star:true,
 note:"<b>Das nützlichste Lied der Welt.</b> Drei Dinge machen es knifflig: Erstens der <b>Walzertakt</b> — drei Schläge pro Takt, nicht vier. Zweitens der <b>Auftakt</b>: Das Wort „Zum“ kommt noch <em>vor</em> dem ersten Takt, du zählst also „eins zwei DREI“ und singst auf der Drei los. Drittens die dritte Zeile, die auf F geht — genau da singen alle falsch. Merk dir den Ablauf als Bogen: weg (G7) — zurück (C) — weg (F) — heim (C).<br><br>Für den Namen in Zeile 3 brauchst du manchmal eine Silbe mehr oder weniger. Das ist kein Problem: Bleib im Takt und quetsch die Silben rein, so macht es jeder.",
 secs:[
  {n:"Deutsch", rows:[
   {b:["C","C","G7"],  x:"[C]Zum | Ge-burts- | tag viel | [G7]Glück,"},
   {b:["G7","G7","C"], x:"[G7]zum | Ge-burts- | tag viel | [C]Glück,"},
   {b:["C","C7","F"],  x:"[C]zum | Ge-burts- | [C7]tag, lie- | [F]be(r) …"},
   {b:["C","G7","C"],  x:"[C]zum | Ge-burts- | [G7]tag viel | [C]Glück!"}
  ]},
  {n:"Englisch", rows:[
   {b:["C","C","G7"],  x:"[C]Hap-py | birth- | day to | [G7]you,"},
   {b:["G7","G7","C"], x:"[G7]hap-py | birth- | day to | [C]you,"},
   {b:["C","C7","F"],  x:"[C]hap-py | birth- | [C7]day dear | [F]…"},
   {b:["C","G7","C"],  x:"[C]hap-py | birth- | [G7]day to | [C]you!"}
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
 secs:[{n:"1. Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Kein schö-ner | [G7]Land in die-ser | [C]Zeit"},
   {b:["C","G7","C"], x:"[C]als hier das | [G7]uns-re weit und | [C]breit,"},
   {b:["F","C","G7"], x:"[F]wo wir uns | [C]fin- | [G7]den"},
   {b:["F","C","G7"], x:"[F]wohl un-ter | [C]Lin- | [G7]den"},
   {b:["C","G7","C"], x:"[C]zur A- | [G7]bend- | [C]zeit."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Da ha-ben wir | [G7]so man-che | [C]Stund"},
   {b:["C","G7","C"], x:"[C]ge-ses-sen da | [G7]in fro-her | [C]Rund,"},
   {b:["F","C","G7"], x:"[F]und ta-ten | [C]sin- | [G7]gen,"},
   {b:["F","C","G7"], x:"[F]die Lie-der | [C]klin- | [G7]gen"},
   {b:["C","G7","C"], x:"[C]im Ei- | [G7]chen- | [C]grund."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Daß wir uns hier | [G7]in die-sem | [C]Tal"},
   {b:["C","G7","C"], x:"[C]noch tref-fen so | [G7]viel hun-dert | [C]Mal,"},
   {b:["F","C","G7"], x:"[F]Gott mag es | [C]schen- | [G7]ken,"},
   {b:["F","C","G7"], x:"[F]Gott mag es | [C]len- | [G7]ken,"},
   {b:["C","G7","C"], x:"[C]er hat die | [G7]Gna- | [C]d."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Nun, Brü-der, | [G7]ei-ne gu-te | [C]Nacht,"},
   {b:["C","G7","C"], x:"[C]der Herr im | [G7]ho-hen Him-mel | [C]wacht."},
   {b:["F","C","G7"], x:"[F]In sei-ner | [C]Gü- | [G7]ten"},
   {b:["F","C","G7"], x:"[F]uns zu be- | [C]hü- | [G7]ten"},
   {b:["C","G7","C"], x:"[C]ist er be- | [G7]dacht. | "}
  ]}
 ]},

{id:"bolle", t:"Bolle reiste jüngst zu Pfingsten", sub:"Berliner Gassenhauer · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Wandertakt", tempo:"120 bpm · 4/4", pd:true,
 note:"Zehn Strophen, alle mit derselben Melodie und demselben Akkordschema — perfekt zum Einspielen, weil du dich nach der ersten Strophe nur noch auf die Schlaghand konzentrieren musst. Der Refrain am Ende jeder Strophe ist immer gleich.",
 secs:[{n:"1. Strophe", rows:[
   {b:["C","C","G7","C"], x:"[C]Bol-le rei-ste | jüngst zu Pfing-sten, | [G7]nach Pan-kow war sein | [C]Ziel,"},
   {b:["C","C","G7","C"], x:"[C]da ver-lor er | sei-nen Jüng-sten, | [G7]ganz Pan-kow such-te | [C]viel."},
   {b:["F","C","G7","C"], x:"[F]Und Bol-le, der war | [C]gar nicht lang-sam, | [G7]er such-te ihn auch | [C]nicht,"},
   {b:["C","C","G7","C"], x:"[C]a-ber den-noch | hat sich Bol-le | [G7]ganz köst-lich | a-mü-[C]siert."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","","G7","C"], x:"[C]In Pan-kow gab's kein | Es-sen, in Pan-kow | [G7]gab's kein | [C]Bier."},
   {b:["C","","G7","C"], x:"[C]War al-les auf-je- | fres-sen von frem-den | [G7]Gäs-ten | [C]hier."},
   {b:["F","C","G7","C"], x:"[F]Nich mal 'ne But-ter- | [C]stul-le hat man ihm | [G7]re-ser- | [C]viert!"},
   {b:["C","","G7","C"], x:"[C]A-ber den-noch | hat sich Bol-le | [G7]janz köst-lich | a-mü-[C]siert."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","","G7","C"], x:"[C]Auf der Schön-hol-zer | Hei-de, da gab's | [G7]'ne Kei-le- | [C]rei."},
   {b:["C","","G7","C"], x:"[C]Und Bol-le, gar nicht | fei-ge, war fes-te | [G7]mang da- | [C]bei."},
   {b:["F","C","G7","C"], x:"[F]Hat's Mes-ser raus-ge- | [C]zo-gen und fün-fe | [G7]mas-sa- | [C]kriert."},
   {b:["C","","G7","C"], x:"[C]A-ber den-noch | hat sich Bol-le | [G7]janz köst-lich | a-mü-[C]siert."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","","G7","C"], x:"[C]Es fing schon an zu | ta-gen, als er sein | [G7]Heim er- | [C]blickt."},
   {b:["C","","G7","C"], x:"[C]Das Hemd war oh-ne | Kra-gen, das Na-sen- | [G7]bein zer- | [C]knickt."},
   {b:["F","C","G7","C"], x:"[F]Das rech-te Au-ge | [C]fehl-te, das lin-ke | [G7]mar-mo- | [C]riert."},
   {b:["C","","G7","C"], x:"[C]A-ber den-noch | hat sich Bol-le | [G7]janz köst-lich | a-mü-[C]siert."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C","","G7","C"], x:"[C]Als er nach Haus ge- | kom-men, da ging's ihm | [G7]a-ber | [C]schlecht."},
   {b:["C","","G7","C"], x:"[C]Da hat ihn sei-ne | Ol-le janz mör-de- | [G7]risch ver- | [C]drescht!"},
   {b:["F","C","G7","C"], x:"[F]'Ne vol-le hal-be | [C]Stun-de hat sie auf | [G7]ihn ein-ge- | [C]rührt."},
   {b:["C","","G7","C"], x:"[C]A-ber den-noch | hat sich Bol-le | [G7]janz köst-lich | a-mü-[C]siert."}
  ]}
 ]},

{id:"gedankenfrei", t:"Die Gedanken sind frei", sub:"Volkslied um 1810 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Walzer", tempo:"120 bpm · 3/4", pd:true, verified:true,
 note:"Das politische Lagerfeuerlied schlechthin — und musikalisch ein Geschenk: <b>drei Akkorde, und G7 macht fast die ganze Arbeit.</b> Es steht im 3/4-Takt mit Auftakt, das heißt, „Die Ge-“ kommt noch <i>vor</i> der Eins. Zähl innerlich „drei“ und setz auf „eins“ den ersten Schlag. Die zweite Hälfte (ab „Kein Mensch kann sie wissen“) hat viermal dasselbe Muster G7 → C — ein perfekter Wechselschlag-Drill, der sich wie Musik anfühlt.",
 src:[{t:"Notenbeispiel (C-Dur, 3/4, Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Die_Gedanken_sind_frei"},{t:"Akkorde silbengenau (A-Dur) — songsguitar.com", u:"https://www.songsguitar.com/die-gedanken-sind-frei-ukulele-g-c-e-a/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C",""],   x:"[C]Die Ge- | dan-ken sind frei, |"},
   {b:["G7","C"], x:"wer | [G7]kann sie er- | [C]ra-ten?"},
   {b:["C",""],   x:"Sie | [C]flie-hen vor-bei |"},
   {b:["G7","C"], x:"wie | [G7]nächt-li-che | [C]Schat-ten."},
   {b:["G7","C"], x:"Kein | [G7]Mensch kann sie | [C]wis-sen,"},
   {b:["G7","C"], x:"kein | [G7]Jä-ger er- | [C]schie-ßen"},
   {b:["F","C"],  x:"mit | [F]Pul-ver und | [C]Blei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
 ]},
{n:"2. Strophe", rows:[
   {b:["C",""],   x:"[C]Ich | den-ke, was ich will, |"},
   {b:["G7","C"], x:"und | [G7]was mich be- | [C]glü-cket,"},
   {b:["C",""],   x:"doch | [C]al-les in der Still', |"},
   {b:["G7","C"], x:"und | [G7]wie es sich | [C]schi-cket."},
   {b:["G7","C"], x:"Mein | [G7]Wunsch und Be- | [C]geh-ren"},
   {b:["G7","C"], x:"kann | [G7]nie-mand ver- | [C]weh-ren,"},
   {b:["F","C"],  x:"es | [F]blei-bet da- | [C]bei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C",""],   x:"[C]Und | sperrt man mich ein |"},
   {b:["G7","C"], x:"im | [G7]fins-te-ren | [C]Ker-ker,"},
   {b:["C",""],   x:"das | [C]al-les sind rein |"},
   {b:["G7","C"], x:"ver- | [G7]geb-li-che | [C]Wer-ke."},
   {b:["G7","C"], x:"Denn | [G7]mei-ne Ge- | [C]dan-ken"},
   {b:["G7","C"], x:"zer- | [G7]rei-ßen die | [C]Schran-ken"},
   {b:["F","C"],  x:"und | [F]Mau-ern ent- | [C]zwei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C",""],   x:"[C]Drum | will ich auf im-mer |"},
   {b:["G7","C"], x:"den | [G7]Sor-gen ent- | [C]sa-gen"},
   {b:["C",""],   x:"und | [C]will mich auch nim-mer |"},
   {b:["G7","C"], x:"mit | [G7]Gril-len mehr | [C]pla-gen."},
   {b:["G7","C"], x:"Man | [G7]kann ja im | [C]Her-zen"},
   {b:["G7","C"], x:"stets | [G7]la-chen und | [C]scher-zen"},
   {b:["F","C"],  x:"und | [F]den-ken da- | [C]bei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C",""],   x:"[C]Ich | lie-be den Wein, |"},
   {b:["G7","C"], x:"mein | [G7]Mäd-chen vor | [C]al-len,"},
   {b:["C",""],   x:"sie | [C]tut mir al-lein |"},
   {b:["G7","C"], x:"am | [G7]bes-ten ge- | [C]fal-len."},
   {b:["G7","C"], x:"Ich | [G7]bin nicht al- | [C]lei-ne"},
   {b:["G7","C"], x:"bei | [G7]mei-nem Glas | [C]Wei-ne,"},
   {b:["F","C"],  x:"mein | [F]Mäd-chen da- | [C]bei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
  ]}
 ]},

{id:"muellerslust", t:"Das Wandern ist des Müllers Lust", sub:"Wilhelm Müller / Carl Friedrich Zöllner, 1844 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Wandertakt", tempo:"108 bpm · 4/4", pd:true, verified:true,
 note:"Im Original steht das Lied im 2/4-Takt — zwei Schläge pro Takt. Hier sind je zwei davon zu einem 4/4-Takt zusammengefasst, damit du ein normales Schlagmuster durchziehen kannst; gesungen klingt es identisch. Inhaltlich ist es dein <b>Ausdauertest</b>: siebenmal fast dasselbe Schema, einmal mit F statt G7 (Zeile 2). Wenn du das Lied ohne Stocken durchbekommst, sitzt der Wechsel C→G7 endgültig.",
 src:[{t:"Notenbeispiel (2/4, Auftakt Achtel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Das_Wandern_ist_des_M%C3%BCllers_Lust"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/das-wandern-ist-des-muellers-lust-ukulele-g-c-e-a-tuning/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C",""],   x:"Das | [C]Wan-dern ist des | Mül-lers Lust,"},
   {b:["F","C"],  x:"das | [F]Wan-dern ist des | [C]Mül-lers Lust,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"},
   {b:["G7","C"], x:"Das | [G7]muß ein schlech-ter | [C]Mül-ler sein,"},
   {b:["G7","C"], x:"dem | [G7]nie-mals fiel das | [C]Wan-dern ein,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"},
   {b:["C","G7"], x:"das | [C]Wan-dern, das | [G7]Wan-dern,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"}
 ]},
{n:"2. Strophe", rows:[
   {b:["C",""],   x:"Vom | [C]Was-ser ha-ben | wir's ge-lernt,"},
   {b:["F","C"],  x:"vom | [F]Was-ser ha-ben | [C]wir's ge-lernt,"},
   {b:["G7","C"], x:"vom | [G7]Was- | [C]ser!"},
   {b:["G7","C"], x:"Das | [G7]hat nicht Rast bei | [C]Tag und Nacht,"},
   {b:["G7","C"], x:"ist | [G7]stets auf Wan-der- | [C]schaft be-dacht,"},
   {b:["G7","C"], x:"das | [G7]Was- | [C]ser!"},
   {b:["C","G7"], x:"Das | [C]Was-ser, das | [G7]Was-ser,"},
   {b:["G7","C"], x:"das | [G7]Was- | [C]ser!"}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C",""],   x:"Das | [C]sehn wir auch den | Rä-dern ab,"},
   {b:["F","C"],  x:"das | [F]sehn wir auch den | [C]Rä-dern ab,"},
   {b:["G7","C"], x:"den | [G7]Rä- | [C]dern!"},
   {b:["G7","C"], x:"Die | [G7]gar nicht ger-ne | [C]stil-le-stehn,"},
   {b:["G7","C"], x:"die | [G7]sich bei Tag nicht | [C]mü-de drehn,"},
   {b:["G7","C"], x:"die | [G7]Rä- | [C]der!"},
   {b:["C","G7"], x:"Die | [C]Rä-der, die | [G7]Rä-der,"},
   {b:["G7","C"], x:"die | [G7]Rä- | [C]der!"}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C",""],   x:"Die | [C]Stei-ne selbst, so | schwer sie sind,"},
   {b:["F","C"],  x:"die | [F]Stei-ne selbst, so | [C]schwer sie sind,"},
   {b:["G7","C"], x:"die | [G7]Stei- | [C]ne!"},
   {b:["G7","C"], x:"Sie | [G7]tan-zen mit den | [C]mun-tern Reihn,"},
   {b:["G7","C"], x:"und | [G7]wol-len gar noch | [C]schnel-ler sein,"},
   {b:["G7","C"], x:"die | [G7]Stei- | [C]ne!"},
   {b:["C","G7"], x:"Die | [C]Stei-ne, die | [G7]Stei-ne,"},
   {b:["G7","C"], x:"die | [G7]Stei- | [C]ne!"}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C",""],   x:"O | [C]Wan-dern, wan-dern, | mei-ne Lust,"},
   {b:["F","C"],  x:"o | [F]wan-dern, wan-dern, | [C]mei-ne Lust,"},
   {b:["G7","C"], x:"o | [G7]wan- | [C]dern!"},
   {b:["G7","C"], x:"Herr | [G7]Meis-ter und Frau | [C]Meis-te-rin,"},
   {b:["G7","C"], x:"laßt | [G7]mich in Frie-den | [C]wei-ter-ziehn,"},
   {b:["G7","C"], x:"und | [G7]wan- | [C]dern!"},
   {b:["C","G7"], x:"Und | [C]wan-dern, und | [G7]wan-dern,"},
   {b:["G7","C"], x:"und | [G7]wan- | [C]dern!"}
  ]}
 ]},

{id:"eisebahne", t:"Auf de schwäb'sche Eisebahne", sub:"Schwäbisches Volkslied · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Achtel durch", tempo:"132 bpm · 4/4", pd:true, verified:true,
 note:"Das Lied, das am Lagerfeuer garantiert lauter wird, je später der Abend. Kein Auftakt — du fängst direkt auf der Eins an, was es zum <b>einfachsten Einstieg unter den schnellen Liedern</b> macht. Der Refrain („Trulla, trulla…“) hat genau dieselben Akkorde wie die Strophe: du lernst also nur ein einziges Schema und spielst damit das ganze Lied. Original in G-Dur und 2/4; hier in C und mit je zwei Takten zusammengefasst.",
 src:[{t:"Notenbeispiel (G-Dur, 2/4, ohne Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Auf_de_schw%C3%A4bsche_Eisebahne"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/auf-der-schwaebsche-eisebahne-ukulele-g-c-e-a-tuning/"}],
 secs:[
  {n:"1. Strophe", rows:[
   {b:["C",""],   x:"[C]Auf de schwäb-sche | Ei-se-bah-ne"},
   {b:["F","C"],  x:"[F]gibt's gar | [C]vie-le Halt-sta-tio-ne:"},
   {b:["G7","C"], x:"[G7]Schtue-gert, Ulm und | [C]Bi-ber-ach,"},
   {b:["G7","C"], x:"[G7]Me-cke-beu-re, | [C]Dur-les-bach."}
  ]},
  {n:"2. Strophe", rows:[
   {b:["C",""],   x:"[C]Auf de schwäb-sche | Ei-se-bah-ne"},
   {b:["F","C"],  x:"[F]gibt's au | [C]vie-le Rest-ra-tio-ne,"},
   {b:["G7","C"], x:"[G7]wo ma es-se, | [C]trin-ke ka,"},
   {b:["G7","C"], x:"[G7]al-les was der | [C]Ma-ge ma."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C",""],   x:"[C]Auf de schwäb-sche | Ei-se-bah-ne"},
   {b:["F","C"],  x:"[F]dür-fet | [C]Kuh und Öchs-le fah-re."},
   {b:["G7","C"], x:"[G7]Bu-be, Mäd-le, | [C]Weib und Ma,"},
   {b:["G7","C"], x:"[G7]kurz-um älls was | [C]zah-le ka."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C",""],   x:"[C]Auf de schwäb-sche | Ei-se-bah-ne"},
   {b:["F","C"],  x:"[F]wollt e- | [C]mol e Bäu-er-le fah-re."},
   {b:["G7","C"], x:"[G7]Goht an Schal-ter, | [C]lupft de Huet:"},
   {b:["G7","C"], x:"[G7]»Oe Bil-lett-le, | [C]send so guet!«"}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C",""],   x:"[C]Ei-nen Bock hat | er sich kau-fet,"},
   {b:["F","C"],  x:"[F]und daß | [C]er ehm net ver-lau-fet,"},
   {b:["G7","C"], x:"[G7]bin-det ehn der | [C]gue-te Ma"},
   {b:["G7","C"], x:"[G7]an de hin-tre | [C]Wa-ge na."}
  ]},
  {n:"6. Strophe", rows:[
   {b:["C",""],   x:"[C]»Böck-le, tu nur | woid-le sprin-ge,"},
   {b:["F","C"],  x:"[F]s' Fut-ter | [C]werd i dir scho brin-ge.«"},
   {b:["G7","C"], x:"[G7]Setzt se zu seim | [C]Weib-le na"},
   {b:["G7","C"], x:"[G7]und brennt's Ta- | [C]baks-pfeif-le a."}
  ]},
  {n:"7. Strophe", rows:[
   {b:["C",""],   x:"[C]Wie der Bau-er | isch am Ziel"},
   {b:["F","C"],  x:"[F]und sei | [C]Böck-le ho-le will,"},
   {b:["G7","C"], x:"[G7]find't er bloß no | [C]Kopf und Seil"},
   {b:["G7","C"], x:"[G7]an dem hin-tre | [C]Wa-ge-teil."}
  ]},
{n:"Refrain (nach jeder Strophe)", rows:[
   {b:["C",""],   x:"[C]Trul-la, trul-la, | trul-la-la,"},
   {b:["F","C"],  x:"[F]trul-la, trul-la, | [C]trul-la-la,"},
   {b:["G7","C"], x:"[G7]Schtue-gert, Ulm und | [C]Bi-ber-ach,"},
   {b:["G7","C"], x:"[G7]Me-cke-beu-re, | [C]Dur-les-bach."}
  ]}
 
 ]},

{id:"horchwas", t:"Horch, was kommt von draußen rein", sub:"Volkslied aus Schwaben, um 1870 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Klassiker", tempo:"120 bpm · 4/4", pd:true, verified:true,
 note:"Ein Wechselgesang: Eine Person singt die Zeile, alle anderen antworten mit „Hollahi, hollaho“. Genau deshalb ist es am Lagerfeuer so dankbar — <b>die Hälfte des Textes muss niemand können.</b> Die Antwortzeilen liegen immer auf G7 → C, also auf dem Wechsel, den du sowieso übst. Nach vier Zeilen kommt einmal F statt C: das ist die einzige Stelle, an der du aufpassen musst.",
 src:[{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/horch-was-kommt-von-draussen-rein-ukulele-g-c-e-a-tuning/"},{t:"Gemeinfreiheit von Text und Melodie — Jurtenland-Wiki", u:"https://jurtenland.eu/wiki/Horch,_was_kommt_von_drau%C3%9Fen_rein"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C",""],   x:"[C]Horch, was kommt von | drau-ßen rein?"},
   {b:["G7","C"], x:"[G7]Hol-la-hi! | [C]Hol-la-ho!"},
   {b:["C",""],   x:"[C]Wird wohl mein Feins- | lieb-chen sein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Geht vor-bei und | [C]schaut nicht rein,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]wird's wohl nicht ge- | [C]we-sen sein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C",""],   x:"[C]Leu-te ha-ben's | oft ge-sagt,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["C",""],   x:"[C]was ich für ein | Feins-lieb-chen hab',"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Laß sie re-den, | [C]schweig fein still,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]kann ja lie-ben, | [C]wen ich will,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C",""],   x:"[C]Wenn mein Lieb-chen | Hoch-zeit hat,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["C",""],   x:"[C]ist für mich ein | Trau-er-tag,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Geh ich in mein | [C]Käm-mer-lein,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]tra-ge mei-nen | [C]Schmerz al-lein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C",""],   x:"[C]Wenn ich dann ge- | stor-ben bin,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["C",""],   x:"[C]trägt man mich zum | Gra-be hin,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Setzt mir ei-nen | [C]Lei-chen-stein,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]pflanzt mir drauf Ver- | [C]giß-nicht-mein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C",""],   x:"[C]Wenn ich dann im | Him-mel bin,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["C",""],   x:"[C]ist mein Lieb-chen | auch dar-in,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Denn es ist ein | [C]al-ter Brauch,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]was sich liebt, das | [C]kriegt sich auch,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
  ]},
  {n:"6. Strophe", rows:[
   {b:["C",""],   x:"[C]Die Lie-be ist ein | Om-ni-bus,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["C",""],   x:"[C]auf den man lan-ge | war-ten muss,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Kommt er end-lich | [C]an-ge-wetzt,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]ruft der Schaff-ner: | [C]»Voll be-setzt!«,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
  ]}
 ]},

{id:"einprosit", t:"Ein Prosit der Gemütlichkeit", sub:"Georg Kunoth, 1898 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Walzer", tempo:"104 bpm · 3/4", pd:true, verified:true,
 note:"Laut GEMA das meistgespielte Lied der Wiesn — und mit vier Zeilen das kürzeste in diesem Buch. Es ist ein <b>Walzer</b>: die Eins ist schwer, zwei und drei sind leicht. Genau deshalb schunkelt der ganze Saal automatisch mit.<br><br>Nach „Schenkt ein, trinkt aus!“ wird nicht gespielt, sondern gerufen: <b>„Oans, zwoa, gsuffa!“</b> — drei Schläge, dann stehen alle Instrumente still. Übe den Abschluss bewusst: sauber aufhören ist schwerer als weiterspielen.<br><br>Im Original steht das Lied in G-Dur mit D als Dominante; hier in C mit <b>G7</b> statt G, weil G7 leichter zu greifen ist und an dieser Stelle genauso klingt.",
 src:[{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/ein-prosit/"},{t:"Georg Kunoth (1863–1927), Urheber von Text und Melodie — Wikipedia", u:"https://de.wikipedia.org/wiki/Georg_Kunoth"}],
 secs:[{n:"Der ganze Song", rows:[
   {b:["C","F","G7","C"],   x:"[C]Ein Pro-sit, | [F]ein Pro-sit der Ge-müt- | [G7]lich- | [C]keit!"},
   {b:["C","F","G7","C"],   x:"[C]Ein Pro-sit, | [F]ein Pro-sit der Ge-müt- | [G7]lich- | [C]keit!"},
   {b:["G7","C","G7","C"],  x:"[G7]Schenkt | [C]ein, | [G7]trinkt | [C]aus!"},
   {b:["G7","C","G7","C"],  x:"[G7]Schenkt | [C]ein, | [G7]trinkt | [C]aus!"}
 ]}]},

{id:"bobbaumeister", textsuche:"Bob der Baumeister Yo wir schaffen das Text deutsch", t:"Bob der Baumeister", sub:"Paul K. Joyce, 2001 · Titellied („Yo, wir schaffen das!“)", lvl:2, key:"C",
 chords:["C","F","G"], strum:"Achtel durch", tempo:"136 bpm · 4/4", verified:true,
 texthinweis:"Suche nach dem deutschen Text von „Yo, wir schaffen das!“ — vier Strophenzeilen, dann der Ruf-und-Antwort-Refrain.",
 note:"Ein Lied, das fast nur zwischen <b>F und C</b> hin- und herspringt — Subdominante und Tonika, mehr braucht es nicht. Genau zweimal pro Strophe kommt stattdessen ein <b>G</b>, und zwar immer an derselben Stelle (Zeile 2 und Zeile 4). Wenn du das hörst, hast du das Lied verstanden.<br><br>Der Refrain ist Ruf und Antwort: einer fragt, alle antworten. Damit funktioniert es mit Kindern am Lagerfeuer sofort, auch wenn niemand den Text auswendig kann. Tempo hoch halten und die Achtel durchziehen — das Lied lebt vom Schwung, nicht von der Genauigkeit.",
 src:[{t:"Akkorde (A-Dur) — e-chords.com", u:"https://www.e-chords.com/chords/misc-cartoons/bob-der-baumeister-theme"}],
 secs:[
  {n:"Strophe", rows:[
   {b:["F","C","F","C"], x:null},
   {b:["F","C","G","C"], x:null},
   {b:["F","C","F","C"], x:null},
   {b:["F","C","G","C"], x:null}
  ]},
  {n:"Refrain (Ruf und Antwort)", rows:[
   {b:["C",""],   x:null},
   {b:["F","G"],  x:null},
   {b:["C",""],   x:null},
   {b:["G","C"],  x:null}
  ]}
 ]},

{id:"alohaoe", t:"Aloha ʻOe", sub:"Königin Liliʻuokalani, 1878 · gemeinfrei", lvl:3, key:"F",
 chords:["F","Bb","C7"], strum:"Der Klassiker", tempo:"84 bpm · 4/4", pd:true,
 note:"Das hawaiianische Abschiedslied, komponiert von der letzten Königin Hawaiis — und damit das einzige Lied in diesem Buch, das wirklich auf einer Ukulele erfunden wurde. Enthält deinen ersten Barré (<b>B♭</b>), aber nur an zwei Stellen im Refrain. Wenn es noch nicht geht: an der Stelle einfach F weiterspielen und beim nächsten Takt wieder einsteigen.",
 secs:[
  {n:"Strophe", rows:[
   {b:["F","F","C7","C7"], x:null},
   {b:["C7","C7","F","F"], x:null}
  ]},
  {n:"Refrain", rows:[
   {b:["F","F","Bb","Bb"], x:"[F]A-lo-ha | ʻoe, | [Bb]a-lo-ha | ʻoe"},
   {b:["F","C7","F","F"],  x:"[F]e ke o-nao-na | [C7]no-ho i ka | [F]li-po |"},
   {b:["F","F","Bb","Bb"], x:"[F]One fond | em-brace, | [Bb]a hoʻi | aʻe au"},
   {b:["F","C7","F","F"],  x:"[F]un-til we | [C7]meet a- | [F]gain. |"}
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

{id:"mondaufgegangen", t:"Der Mond ist aufgegangen", sub:"Matthias Claudius 1779 / J. A. P. Schulz 1790 · gemeinfrei", lvl:3, key:"C",
 chords:["C","Am","F","G","G7"], strum:"Balladenschlag", tempo:"72 bpm · 4/4", pd:true, verified:true,
 note:"Das Lied, mit dem der Abend zu Ende geht. Musikalisch ist es kein Volkslied, sondern ein <b>Choral</b> — die Harmonie wechselt fast auf jedem Schlag. Deshalb steht hier ausnahmsweise <b>ein Kästchen für einen halben Takt</b> (zwei Schläge): anders ließe sich nicht zeigen, wo wirklich umgegriffen wird. Spiel sehr langsam, zwei Schläge pro Kästchen, und lass die Saiten klingen. Die Folge C → G → F → G7 → Am ist der Grund, warum das Lied so tief geht: es endet nicht strahlend in Dur, sondern weich auf Am. Weil vier Spalten pro Zeile am Handy eng werden: Der Umschalter <b>Ansicht → Fließtext</b> oben zeigt dieselben Akkorde über denselben Silben, nur ohne Taktspalten.",
 src:[{t:"Melodie und Satz (F-Dur, 4/4, Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Abendlied_(Matthias_Claudius)"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/der-mond-ist-aufgegangen-ukulele-g-c-e-a-tuning/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Der | [G]Mond ist | [F]auf-ge- | [G7]gan- | [Am]gen,"},
   {b:["C","F","G7","C"],  x:"die | [C]gold-nen | [F]Stern-lein | [G7]pran- | [C]gen"},
   {b:["Am","F","G7","C"], x:"am | [Am]Him- | [F]mel hell | [G7]und | [C]klar;"},
   {b:["G","F","G7","C"],  x:"[C]der | [G]Wald steht | [F]schwarz und | [G7]schwei- | [C]get,"},
   {b:["C","F","G7","C"],  x:"und | [C]aus den | [F]Wie-sen | [G7]stei- | [C]get"},
   {b:["Am","F","G7","C"], x:"der | [Am]wei-ße | [F]Ne-bel | [G7]wun-der- | [C]bar."}
 ]},
{n:"2. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Wie | [G]ist die | [F]Welt so | [G7]stil- | [Am]le"},
   {b:["C","F","G7","C"], x:"und | [C]in der | [F]Dämm-rung | [G7]Hül- | [C]le"},
   {b:["Am","F","G7","C"], x:"so | [Am]trau- | [F]lich und | [G7]so | [C]hold,"},
   {b:["G","F","G7","C"], x:"[C]als | [G]ei-ne | [F]stil-le | [G7]Kam- | [C]mer,"},
   {b:["C","F","G7","C"], x:"wo | [C]ihr des | [F]Ta-ges | [G7]Jam- | [C]mer"},
   {b:["Am","F","G7","C"], x:"ver- | [Am]schla-fen | [F]und ver- | [G7]ges-sen | [C]sollt!"}
  ]},
  {n:"3. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Seht | [G]ihr den | [F]Mond dort | [G7]ste- | [Am]hen?"},
   {b:["C","F","G7","C"], x:"Er | [C]ist nur | [F]halb zu | [G7]se- | [C]hen,"},
   {b:["Am","F","G7","C"], x:"und | [Am]ist | [F]doch rund | [G7]und | [C]schön!"},
   {b:["G","F","G7","C"], x:"[C]So | [G]sind wohl | [F]man-che | [G7]Sa- | [C]chen,"},
   {b:["C","F","G7","C"], x:"die | [C]wir ge- | [F]trost ver- | [G7]la- | [C]chen,"},
   {b:["Am","F","G7","C"], x:"weil | [Am]uns-re | [F]Au-gen | [G7]sie nicht | [C]se-hen."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Wir | [G]stol-ze | [F]Men-schen- | [G7]kin- | [Am]der"},
   {b:["C","F","G7","C"], x:"sind | [C]ei-tel | [F]ar-me | [G7]Sün- | [C]der"},
   {b:["Am","F","G7","C"], x:"und | [Am]wis- | [F]sen gar | [G7]nicht | [C]viel;"},
   {b:["G","F","G7","C"], x:"[C]wir | [G]spin-nen | [F]Luft-ge- | [G7]spins- | [C]te"},
   {b:["C","F","G7","C"], x:"und | [C]su-chen | [F]vie-le | [G7]Küns- | [C]te"},
   {b:["Am","F","G7","C"], x:"und | [Am]kom-men | [F]wei-ter | [G7]von dem | [C]Ziel."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Gott, | [G]laß dein | [F]Heil uns | [G7]schau- | [Am]en,"},
   {b:["C","F","G7","C"], x:"auf | [C]nichts Ver- | [F]gäng-lichs | [G7]trau- | [C]en,"},
   {b:["Am","F","G7","C"], x:"nicht | [Am]Ei- | [F]tel-keit | [G7]uns | [C]freun;"},
   {b:["G","F","G7","C"], x:"[C]laß | [G]uns ein- | [F]fäl-tig | [G7]wer- | [C]den"},
   {b:["C","F","G7","C"], x:"und | [C]vor dir | [F]hier auf | [G7]Er- | [C]den"},
   {b:["Am","F","G7","C"], x:"wie | [Am]Kin-der | [F]fromm und | [G7]fröh-lich | [C]sein!"}
  ]},
  {n:"6. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Wollst | [G]end-lich | [F]son-der | [G7]Grä- | [Am]men"},
   {b:["C","F","G7","C"], x:"aus | [C]die-ser | [F]Welt uns | [G7]neh- | [C]men"},
   {b:["Am","F","G7","C"], x:"durch | [Am]ei- | [F]nen sanf- | [G7]ten | [C]Tod!"},
   {b:["G","F","G7","C"], x:"[C]Und | [G]wenn du | [F]uns ge- | [G7]nom- | [C]men,"},
   {b:["C","F","G7","C"], x:"laß | [C]uns in | [F]Him-mel | [G7]kom- | [C]men,"},
   {b:["Am","F","G7","C"], x:"du | [Am]un-ser | [F]Herr und | [G7]un-ser | [C]Gott!"}
  ]},
  {n:"7. Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]So | [G]legt euch | [F]denn, ihr | [G7]Brü- | [Am]der,"},
   {b:["C","F","G7","C"], x:"in | [C]Got-tes | [F]Na-men | [G7]nie- | [C]der;"},
   {b:["Am","F","G7","C"], x:"kalt | [Am]ist | [F]der A- | [G7]bend- | [C]hauch."},
   {b:["G","F","G7","C"], x:"[C]Ver- | [G]schon uns, | [F]Gott, mit | [G7]Stra- | [C]fen,"},
   {b:["C","F","G7","C"], x:"und | [C]laß uns | [F]ru-hig | [G7]schla- | [C]fen"},
   {b:["Am","F","G7","C"], x:"und | [Am]un-sern | [F]kran-ken | [G7]Nach-barn | [C]auch!"}
  ]}
 ]},

{id:"bruennlein", t:"Wenn alle Brünnlein fließen", sub:"Schwäbisches Volkslied, 16. Jh. · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7"], strum:"Der Klassiker", tempo:"116 bpm · 4/4", pd:true, verified:true,
 note:"Hier lernst du den Unterschied zwischen <b>G und G7</b> im Ohr: G steht mitten in der Zeile und treibt weiter, G7 steht am Schluss und zieht nach C zurück. Die Kästchen sind halbe Takte (zwei Schläge), weil die Harmonie zweimal pro Takt wechselt. Original in G-Dur mit Viertel-Auftakt — „Wenn“ kommt also noch vor der Eins.",
 src:[{t:"Notenbeispiel (G-Dur, 4/4, Auftakt Viertel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Wenn_alle_Br%C3%BCnnlein_flie%C3%9Fen"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/w-songs-lieder/wenn-alle-bruennlein-fliessen/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C","G","C"],       x:"Wenn | [C]al-le | [G]Brünn-lein | [C]flie-ßen,"},
   {b:["F","G"],           x:"so | [F]muß man | [G]trin-ken."},
   {b:["C","G","C"],       x:"Wenn | [C]ich mein'n | [G]Schatz nicht | [C]ru-fen darf,"},
   {b:["F","G"],           x:"tu | [F]ich ihm | [G]win-ken,"},
   {b:["G7","C"],          x:"wenn | [G7]ich mein'n Schatz nicht | [C]ru-fen darf,"},
   {b:["G","C","G7","C"],  x:"[G]ju, ja, | [C]ru-fen darf, | [G7]tu ich ihm win- | [C]ken."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","G","C"], x:"Ja, | [C]win-ken | [G]mit den | [C]Äu-ge-lein,"},
   {b:["F","G"], x:"und | [F]tre-ten | [G]auf den Fuß;"},
   {b:["C","G","C"], x:"'s ist | [C]ei-ne | [G]in der | [C]Stu-be drin,"},
   {b:["F","G"], x:"die | [F]mei-ne | [G]wer-den muß,"},
   {b:["G7","C"], x:"'s ist | [G7]ei-ne in der | [C]Stu-be drin,"},
   {b:["G","C","G7","C"], x:"[G]ju, ja, | [C]Stu-be drin, | [G7]die mei-ne wer- | [C]den muß."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","G","C"], x:"Wa- | [C]rum sollt | [G]sie's nicht | [C]wer-den,"},
   {b:["F","G"], x:"ich | [F]hab sie | [G]ja so gern;"},
   {b:["C","G","C"], x:"sie | [C]hat zwei | [G]blau-e | [C]Äu-ge-lein,"},
   {b:["F","G"], x:"die | [F]leuch-ten | [G]wie zwei Stern,"},
   {b:["G7","C"], x:"sie | [G7]hat zwei blau-e | [C]Äu-ge-lein,"},
   {b:["G","C","G7","C"], x:"[G]ju, ja, | [C]Äu-ge-lein, | [G7]die leuch-ten wie | [C]zwei Stern."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","G","C"], x:"Sie | [C]hat zwei | [G]ro-te | [C]Wän-ge-lein,"},
   {b:["F","G"], x:"sind | [F]rö-ter | [G]als der Wein,"},
   {b:["C","G","C"], x:"ein | [C]sol-ches | [G]Mä-del | [C]findst du nicht,"},
   {b:["F","G"], x:"wohl | [F]un-term | [G]Son-nen-schein,"},
   {b:["G7","C"], x:"ein | [G7]sol-ches Mä-del | [C]findst du nicht,"},
   {b:["G","C","G7","C"], x:"[G]ju, ja, | [C]findst du nicht, | [G7]wohl un-term Son- | [C]nen-schein."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C","G","C"], x:"So | [C]her-zig | [G]wie mein | [C]Lie-se-le"},
   {b:["F","G"], x:"ist | [F]kei-ne | [G]auf der Welt,"},
   {b:["C","G","C"], x:"vom | [C]Kopf bis | [G]zu den | [C]Fü-ße-le"},
   {b:["F","G"], x:"ist | [F]al-les | [G]wohl be-stellt,"},
   {b:["G7","C"], x:"vom | [G7]Kopf bis zu den | [C]Fü-ße-le,"},
   {b:["G","C","G7","C"], x:"[G]ju, ja, | [C]Fü-ße-le, | [G7]ist al-les wohl | [C]be-stellt."}
  ]}
 ]},

{id:"frohewandersmann", t:"Wem Gott will rechte Gunst erweisen", sub:"Joseph von Eichendorff, 1826 · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7","Am"], strum:"Der Wandertakt", tempo:"104 bpm · 4/4", pd:true, verified:true,
 note:"Eichendorffs „Der frohe Wandersmann“ — das Wanderlied, aus dem später halb Deutschland zitiert hat. Für dich ist es vor allem eine <b>Am-Übung im Ernstfall</b>: Am steht zweimal an exponierter Stelle und muss sauber klingen, sonst kippt die Zeile. Achte auf den Schluss von Zeile 2: sie endet auf G, nicht auf C. Das ist Absicht — die Spannung löst sich erst am Liedende.",
 src:[{t:"Akkorde silbengenau (C-Dur) — songsguitar.com", u:"https://www.songsguitar.com/w-songs-lieder/wem-gott-will-rechte-gunst-erweisen/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C","F","C"],        x:"Wem | [C]Gott will | [F]rech-te Gunst er- | [C]wei-sen,"},
   {b:["G7","Am","G"],      x:"den | [G7]schickt er in die | [Am]wei-te | [G]Welt,"},
   {b:["G7","C","F","C"],   x:"dem | [G7]will er | [C]sei-ne Wun-der | [F]wei- | [C]sen"},
   {b:["Am","C","G7","C"],  x:"in | [Am]Berg und Tal und | [C]Strom | [G7]und | [C]Feld."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","F","C"],        x:"Die | [C]Trä-gen, die zu | [F]Hau-se lie- | [C]gen,"},
   {b:["G7","Am","G"],      x:"er- | [G7]qui-cket nicht das | [Am]Mor-gen- | [G]rot,"},
   {b:["G7","C","F","C"],   x:"sie | [G7]wis-sen | [C]nur von Kin-der- | [F]wie- | [C]gen,"},
   {b:["Am","C","G7","C"],  x:"von | [Am]Sor-gen, Last und | [C]Not | [G7]um | [C]Brot."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","F","C"],        x:"Die | [C]Bäch-lein von den | [F]Ber-gen sprin- | [C]gen,"},
   {b:["G7","Am","G"],      x:"die | [G7]Ler-chen schwir-ren | [Am]hoch vor | [G]Lust,"},
   {b:["G7","C","F","C"],   x:"was | [G7]soll ich | [C]nicht mit ih-nen | [F]sin- | [C]gen"},
   {b:["Am","C","G7","C"],  x:"aus | [Am]vol-ler Kehl und | [C]fri- | [G7]scher | [C]Brust?"}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","F","C"],        x:"Den | [C]lie-ben Gott laß | [F]ich nur wal- | [C]ten,"},
   {b:["G7","Am","G"],      x:"der | [G7]Bäch-lein, Ler-chen, | [Am]Wald und | [G]Feld"},
   {b:["G7","C","F","C"],   x:"und | [G7]Erd und | [C]Him-mel will er- | [F]hal- | [C]ten,"},
   {b:["Am","C","G7","C"],  x:"hat | [Am]auch mein Sach aufs | [C]best | [G7]be- | [C]stellt."}
  ]}
 ]},

{id:"mussidenn", t:"Muss i denn zum Städtele hinaus", sub:"Schwäbisches Volkslied / Friedrich Silcher, 1827 · gemeinfrei", lvl:3, key:"C",
 chords:["C","Dm","F","G7"], strum:"Der Wandertakt", tempo:"96 bpm · 4/4", pd:true, verified:true,
 note:"Das deutsche Abschiedslied — und der Grund, warum du <b>Dm</b> können solltest. Dm taucht genau an den Stellen auf, wo es wehmütig wird („und du, mein Schatz, bleibst hier“), und kippt die Zeile aus Dur ins Nachdenkliche. Greif Dm mit Zeige-, Mittel- und Ringfinger und übe erst nur F → Dm, das sind fast dieselben Finger. Original in Es-Dur mit Viertel-Auftakt; hier nach C transponiert (zurück ins Original: +3).",
 src:[{t:"Notenbeispiel (Es-Dur, 4/4, Auftakt Viertel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Mu%C3%9F_i_denn,_mu%C3%9F_i_denn_zum_St%C3%A4dtele_hinaus"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/m-songs-lieder/muss-i-denn-muss-i-denn-zum-staedtele-naus/"}],
 secs:[
  {n:"1. Strophe", rows:[
   {b:["C","G7","C"],        x:"Muss i | [C]denn, muss i | [G7]denn zum | [C]Städ-te-le 'naus,"},
   {b:["C","Dm","G7","C"],   x:"[C]Städ-te-le 'naus, und | [Dm]du, mein | [G7]Schatz, bleibst | [C]hier?"},
   {b:["C","G7","C"],        x:"Wenn i | [C]komm, wenn i | [G7]komm, wenn i | [C]wie-drum komm,"},
   {b:["C","Dm","G7","C"],   x:"[C]wie-drum komm, kehr i | [Dm]ein, mein | [G7]Schatz, bei | [C]dir."}
  ]},
  {n:"1. Strophe, zweiter Teil", rows:[
   {b:["G7","C"],            x:"Kann i | [G7]gleich nit all-weil | [C]bei dir sein,"},
   {b:["F","C"],             x:"han i | [F]doch mein Freud an | [C]dir;"},
   {b:["C","",""],           x:"wenn i | [C]komm, wenn i | komm, wenn i | wie-drum komm,"},
   {b:["Dm","G7","C"],       x:"kehr i | [Dm]ein, mein | [G7]Schatz, bei | [C]dir."}
  ]}
 ,
{n:"2. Strophe", rows:[
   {b:["C","G7","C"],       x:"Wie du | [C]weinst, wie du | [G7]weinst, dass i | [C]wan-de-re muss,"},
   {b:["C","Dm","G7","C"],  x:"[C]wan-de-re muss, wie wenn | [Dm]d'Lieb jetzt | [G7]wär vor- | [C]bei;"},
   {b:["C","G7","C"],       x:"sind au | [C]drauß, sind au | [G7]drauß der | [C]Mä-de-le viel,"},
   {b:["C","Dm","G7","C"],  x:"[C]Mä-de-le viel, lie-ber | [Dm]Schatz, i | [G7]bleib dir | [C]treu."}
  ]},
  {n:"2. Strophe, zweiter Teil", rows:[
   {b:["G7","C"],           x:"Denk du | [G7]net, wenn i en | [C]an-dre seh,"},
   {b:["F","C"],            x:"so sei | [F]mein Lieb vor- | [C]bei,"},
   {b:["C","",""],          x:"sind au | [C]drauß, sind au | drauß der | Mä-de-le viel,"},
   {b:["Dm","G7","C"],      x:"Mä-de-le | [Dm]viel, lie-ber | [G7]Schatz, i bleib dir | [C]treu."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","G7","C"],       x:"Ü-bers | [C]Jahr, ü-bers | [G7]Jahr, wenn me | [C]Träu-be-le schneidt,"},
   {b:["C","Dm","G7","C"],  x:"[C]Träu-be-le schneidt, stell i | [Dm]hier mi | [G7]wie-drum | [C]ein;"},
   {b:["C","G7","C"],       x:"bin i | [C]dann, bin i | [G7]dann dein | [C]Schät-ze-le noch,"},
   {b:["C","Dm","G7","C"],  x:"[C]Schät-ze-le noch, so soll | [Dm]die Hoch- | [G7]zeit | [C]sein."}
  ]},
  {n:"3. Strophe, zweiter Teil", rows:[
   {b:["G7","C"],           x:"Ü-bers | [G7]Jahr, da ist mein | [C]Zeit vor-bei,"},
   {b:["F","C"],            x:"da ge- | [F]hör i mein und | [C]dein,"},
   {b:["C","",""],          x:"bin i | [C]dann, bin i | dann dein | Schät-ze-le noch,"},
   {b:["Dm","G7","C"],      x:"Schät-ze-le | [Dm]noch, so soll | [G7]die Hoch-zeit | [C]sein."}
  ]}
 ]},

{id:"wildeschwaene", t:"Zogen einst fünf wilde Schwäne", sub:"Litauische Volksweise / Karl Plenzat, 1918 · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7"], strum:"Balladenschlag", tempo:"76 bpm · 4/4", pd:true, verified:true,
 note:"Das traurigste Lied in diesem Buch — und eines der schönsten, wenn spät am Feuer alle leiser werden. Es hat <b>keinen Auftakt</b>: du beginnst direkt auf der Eins. Die Kästchen sind halbe Takte, denn die Melodie geht in langen Noten, zwei Silben pro Takt. Spiel es fast zu langsam. Der Wechsel C → F gleich in Takt 1 ist die ganze Stimmung des Liedes.",
 src:[{t:"Notenbeispiel (A-Dur, 4/4, ohne Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Zogen_einst_f%C3%BCnf_wilde_Schw%C3%A4ne"},{t:"Akkorde silbengenau (F-Dur) — songsguitar.com", u:"https://www.songsguitar.com/z-songs-lieder/zogen-einst-fuenf-wilde-schwaene/"}],
 secs:[
  {n:"1. Strophe", rows:[
   {b:["C","F","C",""],      x:"[C]Zo-gen | [F]einst fünf | [C]wil-de | Schwä-ne,"},
   {b:["F","","G7","C"],     x:"[F]Schwä-ne | leuch-tend | [G7]weiß und | [C]schön."}
  ]},
  {n:"2. Strophe", rows:[
   {b:["C","F","C",""],  x:"[C]Wuch-sen | [F]einst fünf | [C]jun-ge | Bir-ken,"},
   {b:["F","","G7","C"], x:"[F]grün und | frisch an | [G7]Ba-ches- | [C]rand."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Kei-ne in | Blü-ten | [C]stand, | ja."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Kei-ne in | Blü-ten | [C]stand. | "}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","F","C",""],  x:"[C]Zo-gen | [F]einst fünf | [C]jun-ge | Bur-schen,"},
   {b:["F","","G7","C"], x:"[F]stolz und | kühn zum | [G7]Kampf hin- | [C]aus."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Kei-ner mehr | kehrt nach | [C]Haus, | ja."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Kei-ner mehr | kehrt nach | [C]Haus. | "}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","F","C",""],  x:"[C]Wuch-sen | [F]einst fünf | [C]jun-ge | Mäd-chen,"},
   {b:["F","","G7","C"], x:"[F]schlank und | schön am | [G7]Me-mel- | [C]strand."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Keins den | Braut-kranz | [C]wand, | ja."},
   {b:["G","","C",""],   x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],  x:"[G7]Keins den | Braut-kranz | [C]wand. | "}
  ]},
{n:"Refrain (nach jeder Strophe)", rows:[
   {b:["G","","C",""],       x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],      x:"[G7]Kei-ner ward | mehr ge- | [C]se-hen, | ja."},
   {b:["G","","C",""],       x:"[G]Sing, | sing, | [C]was ge- | schah?"},
   {b:["G7","","C",""],      x:"[G7]Kei-ner ward | mehr ge- | [C]sehn. | "}
  ]}
 
 ]},

{id:"maiistgekommen", t:"Der Mai ist gekommen", sub:"Emanuel Geibel / Justus Wilhelm Lyra, 1842 · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G7","G","D","D7"], strum:"Walzer", tempo:"116 bpm · 3/4", pd:true, verified:true,
 note:"Das anspruchsvollste Lied dieser Gruppe — und das lehrreichste. In der Mitte („Wie die Wolken dort wandern“) <b>wechselt das Lied die Tonart</b>: es rutscht nach G-Dur hinüber und braucht dafür D und D7, die es sonst nirgends gibt. Genau das erzeugt das Gefühl von Weite, um das es im Text geht. Übe den Sprung C → G → D getrennt, bevor du das Lied am Stück spielst. Original in D-Dur, 3/4 mit Viertel-Auftakt (zurück ins Original: +2).",
 src:[{t:"Notenbeispiel (D-Dur, 3/4, Auftakt Viertel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Der_Mai_ist_gekommen"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/der-mai-ist-gekommen-ukulele/"}],
 secs:[{n:"1. Strophe", rows:[
   {b:["C","F","C"],   x:"[C]Der | Mai ist ge- | [F]kom- | [C]men,"},
   {b:["G7","C"],      x:"die | [G7]Bäu-me schla-gen | [C]aus."},
   {b:["C","F","C"],   x:"Da | [C]blei-be, wer | [F]Lust | [C]hat,"},
   {b:["G7","C"],      x:"mit | [G7]Sor-gen zu | [C]Haus."},
   {b:["G","D"],       x:"Wie die | [G]Wol-ken dort | [D]wan-dern"},
   {b:["D7","G"],      x:"am | [D7]himm-li-schen | [G]Zelt,"},
   {b:["C","F","C"],   x:"so | [C]steht mir der | [F]Sinn | [C]in die"},
   {b:["G7","C"],      x:"[G7]wei-te, wei-te | [C]Welt."}
 ]},
{n:"2. Strophe", rows:[
   {b:["C","F","C"], x:"[C]Herr | Va-ter, Frau | [F]Mut- | [C]ter,"},
   {b:["G7","C"], x:"daß | [G7]Gott euch be- | [C]hüt!"},
   {b:["C","F","C"], x:"Wer | [C]weiß, wo in der | [F]Fer- | [C]ne"},
   {b:["G7","C"], x:"mein | [G7]Glück mir noch | [C]blüht."},
   {b:["G","D"], x:"Es gibt so | [G]man-che Stra- | [D]ße,"},
   {b:["D7","G"], x:"da | [D7]nim-mer ich mar- | [G]schiert;"},
   {b:["C","F","C"], x:"es | [C]gibt so man-chen | [F]Wein, | [C]den ich"},
   {b:["G7","C"], x:"[G7]nim-mer noch pro- | [C]biert."}
  ]},
  {n:"3. Strophe", rows:[
   {b:["C","F","C"], x:"[C]Frisch | auf drum, frisch | [F]auf | [C]im"},
   {b:["G7","C"], x:"[G7]hel-len Son-nen- | [C]strahl,"},
   {b:["C","F","C"], x:"wohl | [C]ü-ber die | [F]Ber- | [C]ge,"},
   {b:["G7","C"], x:"wohl | [G7]durch das tie-fe | [C]Tal!"},
   {b:["G","D"], x:"Die Quel-len er- | [G]klin-gen, die | [D]Bäu-me"},
   {b:["D7","G"], x:"[D7]rau-schen | [G]all,"},
   {b:["C","F","C"], x:"mein | [C]Herz ist wie 'ne | [F]Ler- | [C]che und"},
   {b:["G7","C"], x:"[G7]stim-met ein mit | [C]Schall."}
  ]},
  {n:"4. Strophe", rows:[
   {b:["C","F","C"], x:"[C]Und | a-bends im | [F]Städt- | [C]chen,"},
   {b:["G7","C"], x:"da | [G7]kehr ich durs-tig | [C]ein:"},
   {b:["C","F","C"], x:"Herr | [C]Wirt, mein Herr | [F]Wirt, | [C]ei-ne"},
   {b:["G7","C"], x:"[G7]Kan-ne blan-ken | [C]Wein!"},
   {b:["G","D"], x:"Er-grei-fe die | [G]Fie-del, du | [D]lus-ti-ger"},
   {b:["D7","G"], x:"[D7]Spiel-mann | [G]du,"},
   {b:["C","F","C"], x:"von | [C]mei-nem Schatz das | [F]Lie- | [C]del das"},
   {b:["G7","C"], x:"[G7]sing ich da- | [C]zu."}
  ]},
  {n:"5. Strophe", rows:[
   {b:["C","F","C"], x:"[C]Und | find ich kein | [F]Her- | [C]berg,"},
   {b:["G7","C"], x:"so | [G7]lieg ich zur | [C]Nacht"},
   {b:["C","F","C"], x:"wohl | [C]un-ter blau-em | [F]Him- | [C]mel,"},
   {b:["G7","C"], x:"die | [G7]Ster-ne hal-ten | [C]Wacht."},
   {b:["G","D"], x:"Im Win-de die | [G]Lin-de, die | [D]rauscht mich"},
   {b:["D7","G"], x:"[D7]ein ge- | [G]mach,"},
   {b:["C","F","C"], x:"es | [C]küs-set in der | [F]Früh | [C]das Mor-gen-"},
   {b:["G7","C"], x:"[G7]rot mich | [C]wach."}
  ]}
 ]},

{id:"laterne", t:"Ich geh mit meiner Laterne", sub:"Volksweise, 19. Jh. · gemeinfrei", lvl:3, key:"C",
 chords:["C","Am","Dm","G7"], strum:"Wiegetakt", tempo:"114 bpm · 6/8", pd:true, verified:true,
 note:"Das erste Lied im Buch im <b>6/8-Takt</b> — und deshalb steht hier ein neues Schlagmuster, der Wiegetakt. Sechs Achtel pro Takt, aber nur zwei schwere Punkte: auf der Eins und auf der Vier. Zähl „<b>eins</b> zwei drei <b>vier</b> fünf sechs“ und du hörst sofort, warum Laternenlieder sich anfühlen wie Gehen.<br><br>Musikalisch ist es ein Wechselspiel zwischen <b>C und Am</b>: dieselbe Melodiezeile, einmal hell, einmal dunkel. Genau dieser Wechsel gibt dem Lied seine Abenddämmerung. Die dritte und vierte Zeile bringen Dm dazu — greif zuerst nur F → Dm, das sind fast dieselben Finger.<br><br>Original in G-Dur mit Achtel-Auftakt (zurück ins Original: +7). Die Zeilen „Mein Licht ist aus …“ werden zweimal gesungen; im Raster steht das Paar deshalb doppelt.",
 src:[{t:"Notenbeispiel (G-Dur, 6/8, Auftakt Achtel) und Herkunft als Volksweise — Wikipedia", u:"https://de.wikipedia.org/wiki/Ich_geh_mit_meiner_Laterne"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/ich-geh-mit-meiner-laterne-ukulele-g-c-e-a-tuning/"}],
 secs:[
  {n:"1. Strophe", rows:[
   {b:["C","Am","C","Am"], x:"Ich | [C]geh mit | [Am]mei-ner La- | [C]ter- | [Am]ne"},
   {b:["Dm","G7","C"],     x:"und | [Dm]mei-ne La- | [G7]ter-ne mit | [C]mir."},
   {b:["C","Am","C","Am"], x:"Dort | [C]o-ben | [Am]leuch-ten die | [C]Ster- | [Am]ne,"},
   {b:["Dm","G7","C"],     x:"und | [Dm]un-ten da | [G7]leuch-ten | [C]wir."},
   {b:["C","Am","C","Am"], x:"Mein | [C]Licht ist | [Am]aus, ich | [C]geh nach | [Am]Haus,"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."},
   {b:["C","Am","C","Am"], x:"Mein | [C]Licht ist | [Am]aus, ich | [C]geh nach | [Am]Haus,"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."}
  ]},
  {n:"2. Strophe (Zeile 1–4 wie oben)", rows:[
   {b:["C","Am","C","Am"], x:"La- | [C]ter-nen- | [Am]licht, ver- | [C]lösch mir | [Am]nicht!"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."},
   {b:["C","Am","C","Am"], x:"La- | [C]ter-nen- | [Am]licht, ver- | [C]lösch mir | [Am]nicht!"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."}
  ]},
  {n:"3. Strophe (Zeile 1–4 wie oben)", rows:[
   {b:["C","Am","C","Am"], x:"Ein | [C]Lich-ter- | [Am]meer zu | [C]Mar-tins | [Am]Ehr,"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."},
   {b:["C","Am","C","Am"], x:"Ein | [C]Lich-ter- | [Am]meer zu | [C]Mar-tins | [Am]Ehr,"},
   {b:["Dm","G7","C"],     x:"ra- | [Dm]bim-mel, ra- | [G7]bam-mel, ra- | [C]bumm."}
  ]}
 ]},

