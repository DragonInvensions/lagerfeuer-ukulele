/* Schlagmuster aus der alten App. schlaege: je Achtel D = ab, U = auf, x = Chunk, - = Pause. */
export const SCHLAGMUSTER = [
  {"id":"p1","name":"Der Wandertakt","takt":"4/4","schlaege":["D","-","D","-","D","-","D","-"],"bpm":92,"beschreibung":"Nur Abschläge, einer pro Zählzeit. Damit spielst du dein erstes Lied — und es klingt vollkommen in Ordnung. Alles Weitere ist Kür."},
  {"id":"p2","name":"Achtel durch","takt":"4/4","schlaege":["D","U","D","U","D","U","D","U"],"bpm":88,"beschreibung":"Runter, rauf, runter, rauf — ohne Auslassung. Der Motor für schnelle, fröhliche Lieder. Achte darauf, dass die Aufschläge leiser bleiben als die Abschläge."},
  {"id":"p3","name":"Der Klassiker","takt":"4/4","schlaege":["D","-","D","U","-","U","D","U"],"bpm":84,"beschreibung":"D · D U · U D U — das Standardmuster für Ukulele und Lagerfeuergitarre. Das größte Missverständnis: Die Hand pendelt bei den Pausen weiter, sie trifft die Saiten nur nicht. Wenn du dieses eine Muster kannst, kannst du drei Viertel aller Lieder."},
  {"id":"p4","name":"Walzer","takt":"3/4","schlaege":["D","-","D","U","D","U"],"bpm":100,"beschreibung":"Drei Zählzeiten statt vier. Der erste Schlag ist der schwere. Brauchst du für Zum Geburtstag viel Glück und Amazing Grace."},
  {"id":"p5","name":"Balladenschlag","takt":"4/4","schlaege":["D","-","D","U","D","-","D","U"],"bpm":76,"beschreibung":"Ruhig und tragend, mit einem leichten Ziehen auf der Zwei und der Vier. Für alles Langsame: Let It Be, Knockin' on Heaven's Door, Country Roads."},
  {"id":"p7","name":"Wiegetakt","takt":"6/8","schlaege":["D","-","U","D","-","U"],"bpm":114,"beschreibung":"Der 6/8-Takt: sechs Achtel, aber nur zwei schwere Punkte — auf der Eins und auf der Vier. Zähl „eins zwei drei, vier fünf sechs“ und schlag auf eins und vier nach unten, auf drei und sechs leicht nach oben. Das ergibt das Wiegen, an dem man Laternen- und Schifferlieder sofort erkennt."},
  {"id":"p6","name":"Chunk","takt":"4/4","schlaege":["D","-","x","-","D","-","x","-"],"bpm":96,"beschreibung":"Das x ist ein Abschlag, bei dem der Handballen gleichzeitig auf die Saiten fällt — es klackt statt zu klingen. Das ist deine Snaredrum. Klingt nach Band statt nach Anfänger."}
];

export function schlagmusterNamens(name) {
  return SCHLAGMUSTER.find((eintrag) => eintrag.name === name) ?? SCHLAGMUSTER[0];
}
