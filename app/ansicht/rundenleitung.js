/* Mitsingen leiten: Jakob startet eine Runde, zeigt den QR-Code und meldet seinen Stand, bis er die Runde beendet.
   Die Runde gilt fuer den Abend: Sie bleibt beim Liedwechsel bestehen und folgt Jakob ins naechste Lied. */
import { esc } from "./html.js";
import { qrMatrix } from "../kern/qr.js";
import { gemerkteRunde, rundeAnlegen, rundeBeenden, rundenLink, standMelder } from "../daten/runde.js";
import { linkzeileHTML, linkzeileAnbinden } from "./linkzeile.js";

/* Ein Herzschlag haelt Nachzuegler und frisch Verbundene auf Stand; Start, Pause, Tempo und Sprung melden sofort */
const HERZSCHLAG = 2000;

export function rundenleitungAnlegen(knopf, dialog, standHolen) {
  let token = gemerkteRunde(), melden = null, herzschlag = 0, schluss = null;

  function verbinden() {
    clearInterval(herzschlag);
    melden = token ? standMelder(token, { standHolen: () => schluss ?? standHolen(), vorbei }) : null;
    knopf.setAttribute("aria-pressed", String(Boolean(token)));
    if (!melden) return;
    herzschlag = setInterval(melden, HERZSCHLAG);
    melden();
  }
  function vorbei() {
    token = null;
    verbinden();
    if (dialog.open) dialog.close();
  }

  async function oeffnen() {
    dialog.innerHTML = `<p class="leise">Runde wird angelegt …</p>`;
    dialog.showModal();
    if (!token) {
      try {
        token = await rundeAnlegen(standHolen().lied);
      } catch (fehler) {
        dialog.innerHTML = `<h2>Mitsingen</h2><p class="fehler" role="alert">Keine Runde angelegt: ${esc(fehler.message)}</p>
          <div class="dialogknoepfe"><button class="knopf schliessen" type="button">Schließen</button></div>`;
        dialog.querySelector(".schliessen").addEventListener("click", () => dialog.close());
        return;
      }
      verbinden();
    }
    dialogFuellen();
  }

  function dialogFuellen() {
    const link = rundenLink(token);
    dialog.innerHTML = `
      <h2>Mitsingen</h2>
      <p class="anleitung">Freunde scannen den Code mit der Handykamera und lesen den Text im Takt mit, ohne Anmeldung.</p>
      <div class="qrkarte">${qrSvg(link)}</div>
      ${linkzeileHTML(link, "Link zur Runde")}
      <p class="leise">Wer den Code hat, sieht das Lied, das du gerade spielst, samt Text, bis du die Runde beendest. Die Runde folgt dir ins nächste Lied.</p>
      <div class="dialogknoepfe">
        <button class="knopf beenden" type="button">Runde beenden</button>
        <button class="knopf schliessen" type="button">Fertig</button>
      </div>`;
    linkzeileAnbinden(dialog);
    dialog.querySelector(".schliessen").addEventListener("click", () => dialog.close());
    dialog.querySelector(".beenden").addEventListener("click", async () => {
      const ende = token;
      vorbei();
      await rundeBeenden(ende).catch((fehler) => console.info("Runde nicht beendet, sie laeuft nach sechs Stunden Ruhe ab:", fehler.message));
    });
    dialog.querySelector(".schliessen").focus();
  }

  knopf.addEventListener("click", oeffnen);
  verbinden();

  return {
    melden: () => melden?.(),
    /* Beim Verlassen des Lieds: als angehalten melden, damit die Freunde nicht ins Leere weiterlaufen */
    beenden() {
      clearInterval(herzschlag);
      if (!melden) return;
      schluss = { ...standHolen(), laeuft: false };
      melden();
    },
  };
}

/* Dunkle Module als ein Pfad, mit 4 Modulen heller Ruhezone; die Farben setzt stil.css */
function qrSvg(text) {
  const matrix = qrMatrix(text), rand = 4, kante = matrix.length + 2 * rand;
  const pfad = matrix.flatMap((zeile, y) => zeile.map((dunkel, x) => (dunkel ? `M${x + rand} ${y + rand}h1v1h-1z` : ""))).join("");
  return `<svg class="qr" viewBox="0 0 ${kante} ${kante}" role="img" aria-label="QR-Code zur Runde" shape-rendering="crispEdges"><rect width="${kante}" height="${kante}"/><path d="${pfad}"/></svg>`;
}
