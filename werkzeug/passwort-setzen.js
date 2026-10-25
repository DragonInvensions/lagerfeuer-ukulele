/* Setzt Jakobs Passwort fuer die Lagerfeuer-Ukulele. Liest es von der Standardeingabe,
   damit es weder in der Befehlszeile noch in der Shell-Historie steht.
   Auf Jarvis ueber deploy/passwort-setzen.sh aufrufen (fragt verdeckt zweimal nach). */
import { zugangAnlegen } from "../server/zugang.js";

const ordner = process.env.UKULELE_DATEN;
if (!ordner) {
  console.error("UKULELE_DATEN ist nicht gesetzt.");
  process.exit(2);
}
let eingabe = "";
process.stdin.setEncoding("utf8");
for await (const stueck of process.stdin) eingabe += stueck;
const passwort = eingabe.replace(/\r?\n$/, "");
try {
  zugangAnlegen(ordner).passwortSetzen(passwort);
  console.log("Passwort gesetzt. Alle bisherigen Anmeldungen sind damit abgemeldet.");
} catch (fehler) {
  console.error(fehler.message);
  process.exit(1);
}
