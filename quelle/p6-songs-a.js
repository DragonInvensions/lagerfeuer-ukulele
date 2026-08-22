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
 secs:[{n:"Lied", rows:[
   {b:["C","C"],  x:"[C]Al-le mei-ne | Ent-chen"},
   {b:["G7","C"], x:"[G7]schwim-men auf dem See, | [C]schwim-men auf dem See,"},
   {b:["C","C"],  x:"[C]Köpf-chen in das | Was-ser,"},
   {b:["G7","C"], x:"[G7]Schwänz-chen in die | [C]Höh."}
 ]}]},

{id:"haenschen", t:"Hänschen klein", sub:"Traditionell · gemeinfrei", lvl:1, key:"C",
 chords:["C","G7"], strum:"Der Wandertakt", tempo:"100 bpm · 4/4", pd:true, verified:true,
 note:"Dieselben zwei Akkorde, aber der Wechsel kommt öfter und in Zeile 3 auf einer ungewohnten Stelle. Gutes Training fürs Mitzählen: Sprich beim Spielen laut „eins zwei drei vier“ mit.",
 secs:[{n:"Lied", rows:[
   {b:["C","C","G7","C"],  x:"[C]Häns-chen klein | ging al-lein | [G7]in die wei-te | [C]Welt hin-ein."},
   {b:["C","C","G7","C"],  x:"[C]Stock und Hut | steht ihm gut, | [G7]ist gar | [C]wohl-ge-mut."},
   {b:["G7","C","G7","C"], x:"[G7]A-ber Mut-ter | [C]wei-net sehr, | [G7]hat ja nun kein | [C]Häns-chen mehr!"},
   {b:["C","C","G7","C"],  x:"[C]»Wünsch dir Glück!«, | sagt ihr Blick, | [G7]»kehr nur bald | zu-[C]rück!«"}
 ]}]},

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
 note:"<b>Zwei Akkorde, unendlich viele Strophen</b> — das perfekte Lagerfeuerlied für eine Runde, in der nicht alle textsicher sind: Den Refrain „Fiderallala“ kann nach einer Strophe jeder mitsingen. Original im 2/4-Takt, deshalb steht hier ein Kästchen für einen halben Takt; zwei Kästchen sind ein Durchgang deines Schlagmusters. Der Wechsel C → G7 fällt immer auf dieselbe Stelle, Strophe für Strophe — genau deshalb ist es so gutes Trainingsmaterial.<br><br><b>Weitere Strophen</b> (gleiches Schema): Die Drossel war der Bräutigam, die Amsel war die Braute. · Der Sperber, der Sperber, der war der Hochzeitswerber. · Die Lerche, die Lerche, die führt die Braut zur Kerche. · Der Auerhahn, der Auerhahn, der war der stolze Herr Kaplan. · Die Meise, die Meise, die bringt der Braut die Speise. · Der Kuckuck schreit, der Kuckuck schreit, er bringt der Braut das Hochzeitskleid. · Der Uhu, der Uhu, der bringt der Braut die Hochzeitsschuh. · Nun ist die Vogelhochzeit aus, und alle ziehn vergnügt nach Haus.",
 src:[{t:"Notenbeispiel (G-Dur, 2/4, Auftakt Achtel) und Herkunft — Wikipedia", u:"https://de.wikipedia.org/wiki/Die_Vogelhochzeit"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/e-songs-lieder/ein-vogel-wollte-hochzeit-machen/"}],
 secs:[{n:"Strophe (Schema für alle)", rows:[
   {b:["C","G7"],      x:"Ein | [C]Vo-gel woll-te | [G7]Hoch-zeit ma-chen"},
   {b:["G7","C"],      x:"[G7]in dem grü-nen | [C]Wal-de."},
   {b:["C","G7"],      x:"[C]Fi-de-ral-la-la, | [G7]fi-de-ral-la-la,"},
   {b:["C","G7","C"],  x:"[C]fi-de-ral-la- | [G7]la-la- | [C]la."}
 ]}]},

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
 secs:[{n:"Strophe", rows:[
   {b:["C","G7","C"], x:"[C]Kein schö-ner | [G7]Land in die-ser | [C]Zeit"},
   {b:["C","G7","C"], x:"[C]als hier das | [G7]uns-re weit und | [C]breit,"},
   {b:["F","C","G7"], x:"[F]wo wir uns | [C]fin- | [G7]den"},
   {b:["F","C","G7"], x:"[F]wohl un-ter | [C]Lin- | [G7]den"},
   {b:["C","G7","C"], x:"[C]zur A- | [G7]bend- | [C]zeit."}
 ]}]},

{id:"bolle", t:"Bolle reiste jüngst zu Pfingsten", sub:"Berliner Gassenhauer · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Wandertakt", tempo:"120 bpm · 4/4", pd:true,
 note:"Zehn Strophen, alle mit derselben Melodie und demselben Akkordschema — perfekt zum Einspielen, weil du dich nach der ersten Strophe nur noch auf die Schlaghand konzentrieren musst. Der Refrain am Ende jeder Strophe ist immer gleich.",
 secs:[{n:"Strophe (Schema für alle)", rows:[
   {b:["C","C","G7","C"], x:"[C]Bol-le rei-ste | jüngst zu Pfing-sten, | [G7]nach Pan-kow war sein | [C]Ziel,"},
   {b:["C","C","G7","C"], x:"[C]da ver-lor er | sei-nen Jüng-sten, | [G7]ganz Pan-kow such-te | [C]viel."},
   {b:["F","C","G7","C"], x:"[F]Und Bol-le, der war | [C]gar nicht lang-sam, | [G7]er such-te ihn auch | [C]nicht,"},
   {b:["C","C","G7","C"], x:"[C]a-ber den-noch | hat sich Bol-le | [G7]ganz köst-lich | a-mü-[C]siert."}
 ]}]},

{id:"gedankenfrei", t:"Die Gedanken sind frei", sub:"Volkslied um 1810 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Walzer", tempo:"120 bpm · 3/4", pd:true, verified:true,
 note:"Das politische Lagerfeuerlied schlechthin — und musikalisch ein Geschenk: <b>drei Akkorde, und G7 macht fast die ganze Arbeit.</b> Es steht im 3/4-Takt mit Auftakt, das heißt, „Die Ge-“ kommt noch <i>vor</i> der Eins. Zähl innerlich „drei“ und setz auf „eins“ den ersten Schlag. Die zweite Hälfte (ab „Kein Mensch kann sie wissen“) hat viermal dasselbe Muster G7 → C — ein perfekter Wechselschlag-Drill, der sich wie Musik anfühlt.",
 src:[{t:"Notenbeispiel (C-Dur, 3/4, Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Die_Gedanken_sind_frei"},{t:"Akkorde silbengenau (A-Dur) — songsguitar.com", u:"https://www.songsguitar.com/die-gedanken-sind-frei-ukulele-g-c-e-a/"}],
 secs:[{n:"Strophe", rows:[
   {b:["C",""],   x:"[C]Die Ge- | dan-ken sind frei, |"},
   {b:["G7","C"], x:"wer | [G7]kann sie er- | [C]ra-ten?"},
   {b:["C",""],   x:"Sie | [C]flie-hen vor-bei |"},
   {b:["G7","C"], x:"wie | [G7]nächt-li-che | [C]Schat-ten."},
   {b:["G7","C"], x:"Kein | [G7]Mensch kann sie | [C]wis-sen,"},
   {b:["G7","C"], x:"kein | [G7]Jä-ger er- | [C]schie-ßen"},
   {b:["F","C"],  x:"mit | [F]Pul-ver und | [C]Blei,"},
   {b:["G7","C"], x:"die Ge- | [G7]dan-ken sind | [C]frei!"}
 ]}]},

{id:"muellerslust", t:"Das Wandern ist des Müllers Lust", sub:"Wilhelm Müller / Carl Friedrich Zöllner, 1844 · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Der Wandertakt", tempo:"108 bpm · 4/4", pd:true, verified:true,
 note:"Im Original steht das Lied im 2/4-Takt — zwei Schläge pro Takt. Hier sind je zwei davon zu einem 4/4-Takt zusammengefasst, damit du ein normales Schlagmuster durchziehen kannst; gesungen klingt es identisch. Inhaltlich ist es dein <b>Ausdauertest</b>: siebenmal fast dasselbe Schema, einmal mit F statt G7 (Zeile 2). Wenn du das Lied ohne Stocken durchbekommst, sitzt der Wechsel C→G7 endgültig.",
 src:[{t:"Notenbeispiel (2/4, Auftakt Achtel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Das_Wandern_ist_des_M%C3%BCllers_Lust"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/das-wandern-ist-des-muellers-lust-ukulele-g-c-e-a-tuning/"}],
 secs:[{n:"Strophe", rows:[
   {b:["C",""],   x:"Das | [C]Wan-dern ist des | Mül-lers Lust,"},
   {b:["F","C"],  x:"das | [F]Wan-dern ist des | [C]Mül-lers Lust,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"},
   {b:["G7","C"], x:"Das | [G7]muß ein schlech-ter | [C]Mül-ler sein,"},
   {b:["G7","C"], x:"dem | [G7]nie-mals fiel das | [C]Wan-dern ein,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"},
   {b:["C","G7"], x:"das | [C]Wan-dern, das | [G7]Wan-dern,"},
   {b:["G7","C"], x:"das | [G7]Wan- | [C]dern!"}
 ]}]},

{id:"eisebahne", t:"Auf de schwäb'sche Eisebahne", sub:"Schwäbisches Volkslied · gemeinfrei", lvl:2, key:"C",
 chords:["C","F","G7"], strum:"Achtel durch", tempo:"132 bpm · 4/4", pd:true, verified:true,
 note:"Das Lied, das am Lagerfeuer garantiert lauter wird, je später der Abend. Kein Auftakt — du fängst direkt auf der Eins an, was es zum <b>einfachsten Einstieg unter den schnellen Liedern</b> macht. Der Refrain („Trulla, trulla…“) hat genau dieselben Akkorde wie die Strophe: du lernst also nur ein einziges Schema und spielst damit das ganze Lied. Original in G-Dur und 2/4; hier in C und mit je zwei Takten zusammengefasst.",
 src:[{t:"Notenbeispiel (G-Dur, 2/4, ohne Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Auf_de_schw%C3%A4bsche_Eisebahne"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/auf-der-schwaebsche-eisebahne-ukulele-g-c-e-a-tuning/"}],
 secs:[
  {n:"Strophe", rows:[
   {b:["C",""],   x:"[C]Auf de schwäb-sche | Ei-se-bah-ne"},
   {b:["F","C"],  x:"[F]gibt's gar | [C]vie-le Halt-sta-tio-ne:"},
   {b:["G7","C"], x:"[G7]Schtue-gert, Ulm und | [C]Bi-ber-ach,"},
   {b:["G7","C"], x:"[G7]Me-cke-beu-re, | [C]Dur-les-bach."}
  ]},
  {n:"Refrain", rows:[
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
 secs:[{n:"Strophe", rows:[
   {b:["C",""],   x:"[C]Horch, was kommt von | drau-ßen rein?"},
   {b:["G7","C"], x:"[G7]Hol-la-hi! | [C]Hol-la-ho!"},
   {b:["C",""],   x:"[C]Wird wohl mein Feins- | lieb-chen sein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."},
   {b:["F","C"],  x:"[F]Geht vor-bei und | [C]schaut nicht rein,"},
   {b:["G7","C"], x:"[G7]hol-la-hi, | [C]hol-la-ho,"},
   {b:["F","C"],  x:"[F]wird's wohl nicht ge- | [C]we-sen sein,"},
   {b:["G7","C"], x:"[G7]hol-la-hia- | [C]ho."}
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
 secs:[{n:"Strophe", rows:[
   {b:["G","F","G7","Am"], x:"[C]Der | [G]Mond ist | [F]auf-ge- | [G7]gan- | [Am]gen,"},
   {b:["C","F","G7","C"],  x:"die | [C]gold-nen | [F]Stern-lein | [G7]pran- | [C]gen"},
   {b:["Am","F","G7","C"], x:"am | [Am]Him- | [F]mel hell | [G7]und | [C]klar;"},
   {b:["G","F","G7","C"],  x:"[C]der | [G]Wald steht | [F]schwarz und | [G7]schwei- | [C]get,"},
   {b:["C","F","G7","C"],  x:"und | [C]aus den | [F]Wie-sen | [G7]stei- | [C]get"},
   {b:["Am","F","G7","C"], x:"der | [Am]wei-ße | [F]Ne-bel | [G7]wun-der- | [C]bar."}
 ]}]},

{id:"bruennlein", t:"Wenn alle Brünnlein fließen", sub:"Schwäbisches Volkslied, 16. Jh. · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7"], strum:"Der Klassiker", tempo:"116 bpm · 4/4", pd:true, verified:true,
 note:"Hier lernst du den Unterschied zwischen <b>G und G7</b> im Ohr: G steht mitten in der Zeile und treibt weiter, G7 steht am Schluss und zieht nach C zurück. Die Kästchen sind halbe Takte (zwei Schläge), weil die Harmonie zweimal pro Takt wechselt. Original in G-Dur mit Viertel-Auftakt — „Wenn“ kommt also noch vor der Eins.",
 src:[{t:"Notenbeispiel (G-Dur, 4/4, Auftakt Viertel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Wenn_alle_Br%C3%BCnnlein_flie%C3%9Fen"},{t:"Akkorde silbengenau (G-Dur) — songsguitar.com", u:"https://www.songsguitar.com/w-songs-lieder/wenn-alle-bruennlein-fliessen/"}],
 secs:[{n:"Strophe", rows:[
   {b:["C","G","C"],       x:"Wenn | [C]al-le | [G]Brünn-lein | [C]flie-ßen,"},
   {b:["F","G"],           x:"so | [F]muß man | [G]trin-ken."},
   {b:["C","G","C"],       x:"Wenn | [C]ich mein'n | [G]Schatz nicht | [C]ru-fen darf,"},
   {b:["F","G"],           x:"tu | [F]ich ihm | [G]win-ken,"},
   {b:["G7","C"],          x:"wenn | [G7]ich mein'n Schatz nicht | [C]ru-fen darf,"},
   {b:["G","C","G7","C"],  x:"[G]ju, ja, | [C]ru-fen darf, | [G7]tu ich ihm win- | [C]ken."}
 ]}]},

{id:"frohewandersmann", t:"Wem Gott will rechte Gunst erweisen", sub:"Joseph von Eichendorff, 1826 · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7","Am"], strum:"Der Wandertakt", tempo:"104 bpm · 4/4", pd:true, verified:true,
 note:"Eichendorffs „Der frohe Wandersmann“ — das Wanderlied, aus dem später halb Deutschland zitiert hat. Für dich ist es vor allem eine <b>Am-Übung im Ernstfall</b>: Am steht zweimal an exponierter Stelle und muss sauber klingen, sonst kippt die Zeile. Achte auf den Schluss von Zeile 2: sie endet auf G, nicht auf C. Das ist Absicht — die Spannung löst sich erst am Liedende.",
 src:[{t:"Akkorde silbengenau (C-Dur) — songsguitar.com", u:"https://www.songsguitar.com/w-songs-lieder/wem-gott-will-rechte-gunst-erweisen/"}],
 secs:[{n:"Strophe", rows:[
   {b:["C","F","C"],        x:"Wem | [C]Gott will | [F]rech-te Gunst er- | [C]wei-sen,"},
   {b:["G7","Am","G"],      x:"den | [G7]schickt er in die | [Am]wei-te | [G]Welt,"},
   {b:["G7","C","F","C"],   x:"dem | [G7]will er | [C]sei-ne Wun-der | [F]wei- | [C]sen"},
   {b:["Am","C","G7","C"],  x:"in | [Am]Berg und Tal und | [C]Strom | [G7]und | [C]Feld."}
 ]}]},

{id:"mussidenn", t:"Muss i denn zum Städtele hinaus", sub:"Schwäbisches Volkslied / Friedrich Silcher, 1827 · gemeinfrei", lvl:3, key:"C",
 chords:["C","Dm","F","G7"], strum:"Der Wandertakt", tempo:"96 bpm · 4/4", pd:true, verified:true,
 note:"Das deutsche Abschiedslied — und der Grund, warum du <b>Dm</b> können solltest. Dm taucht genau an den Stellen auf, wo es wehmütig wird („und du, mein Schatz, bleibst hier“), und kippt die Zeile aus Dur ins Nachdenkliche. Greif Dm mit Zeige-, Mittel- und Ringfinger und übe erst nur F → Dm, das sind fast dieselben Finger. Original in Es-Dur mit Viertel-Auftakt; hier nach C transponiert (zurück ins Original: +3).",
 src:[{t:"Notenbeispiel (Es-Dur, 4/4, Auftakt Viertel) — Wikipedia", u:"https://de.wikipedia.org/wiki/Mu%C3%9F_i_denn,_mu%C3%9F_i_denn_zum_St%C3%A4dtele_hinaus"},{t:"Akkorde silbengenau (D-Dur) — songsguitar.com", u:"https://www.songsguitar.com/m-songs-lieder/muss-i-denn-muss-i-denn-zum-staedtele-naus/"}],
 secs:[
  {n:"Strophe", rows:[
   {b:["C","G7","C"],        x:"Muss i | [C]denn, muss i | [G7]denn zum | [C]Städ-te-le 'naus,"},
   {b:["C","Dm","G7","C"],   x:"[C]Städ-te-le 'naus, und | [Dm]du, mein | [G7]Schatz, bleibst | [C]hier?"},
   {b:["C","G7","C"],        x:"Wenn i | [C]komm, wenn i | [G7]komm, wenn i | [C]wie-drum komm,"},
   {b:["C","Dm","G7","C"],   x:"[C]wie-drum komm, kehr i | [Dm]ein, mein | [G7]Schatz, bei | [C]dir."}
  ]},
  {n:"Zweiter Teil", rows:[
   {b:["G7","C"],            x:"Kann i | [G7]gleich nit all-weil | [C]bei dir sein,"},
   {b:["F","C"],             x:"han i | [F]doch mein Freud an | [C]dir;"},
   {b:["C","",""],           x:"wenn i | [C]komm, wenn i | komm, wenn i | wie-drum komm,"},
   {b:["Dm","G7","C"],       x:"kehr i | [Dm]ein, mein | [G7]Schatz, bei | [C]dir."}
  ]}
 ]},

{id:"wildeschwaene", t:"Zogen einst fünf wilde Schwäne", sub:"Litauische Volksweise / Karl Plenzat, 1918 · gemeinfrei", lvl:3, key:"C",
 chords:["C","F","G","G7"], strum:"Balladenschlag", tempo:"76 bpm · 4/4", pd:true, verified:true,
 note:"Das traurigste Lied in diesem Buch — und eines der schönsten, wenn spät am Feuer alle leiser werden. Es hat <b>keinen Auftakt</b>: du beginnst direkt auf der Eins. Die Kästchen sind halbe Takte, denn die Melodie geht in langen Noten, zwei Silben pro Takt. Spiel es fast zu langsam. Der Wechsel C → F gleich in Takt 1 ist die ganze Stimmung des Liedes.",
 src:[{t:"Notenbeispiel (A-Dur, 4/4, ohne Auftakt) — Wikipedia", u:"https://de.wikipedia.org/wiki/Zogen_einst_f%C3%BCnf_wilde_Schw%C3%A4ne"},{t:"Akkorde silbengenau (F-Dur) — songsguitar.com", u:"https://www.songsguitar.com/z-songs-lieder/zogen-einst-fuenf-wilde-schwaene/"}],
 secs:[
  {n:"Strophe", rows:[
   {b:["C","F","C",""],      x:"[C]Zo-gen | [F]einst fünf | [C]wil-de | Schwä-ne,"},
   {b:["F","","G7","C"],     x:"[F]Schwä-ne | leuch-tend | [G7]weiß und | [C]schön."}
  ]},
  {n:"Refrain", rows:[
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
 secs:[{n:"Strophe", rows:[
   {b:["C","F","C"],   x:"[C]Der | Mai ist ge- | [F]kom- | [C]men,"},
   {b:["G7","C"],      x:"die | [G7]Bäu-me schla-gen | [C]aus."},
   {b:["C","F","C"],   x:"Da | [C]blei-be, wer | [F]Lust | [C]hat,"},
   {b:["G7","C"],      x:"mit | [G7]Sor-gen zu | [C]Haus."},
   {b:["G","D"],       x:"Wie die | [G]Wol-ken dort | [D]wan-dern"},
   {b:["D7","G"],      x:"am | [D7]himm-li-schen | [G]Zelt,"},
   {b:["C","F","C"],   x:"so | [C]steht mir der | [F]Sinn | [C]in die"},
   {b:["G7","C"],      x:"[G7]wei-te, wei-te | [C]Welt."}
 ]}]},

