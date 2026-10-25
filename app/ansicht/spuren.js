/* Die drei Spuren des Mitspielens: Akkord-Lesefaden, Liedtext, Schlagmuster.
   Jede Spur baut ihr Geruest einmal und aendert danach je Bild nur, was sich wirklich aendert. */
import { esc } from "./html.js";
import {
  viertelProTakt, akkordBei, naechsterAkkord, akkordDauer, zeileBei, zeilenEnde, silbenDerZeile, transponiere,
} from "../kern/liedspur.js";
import { griffbildSVG } from "./griffbild.js";
import { symbol } from "./symbole.js";

const NADEL_ANTEIL = 0.22; /* die Spiellinie steht bei gut einem Fuenftel der Breite */
const NAMENSBREITE = 52;   /* Platz fuer einen Akkordnamen wie G7 oder Dm am Blockende; laengere werden knapp beschnitten */

/* ---------- Akkord-Lesefaden ---------- */
export function fadenAnlegen(element, lied, halbtoene) {
  const streifen = element.querySelector(".streifen");
  const proTakt = viertelProTakt(lied);
  let pixelProViertel = 0, aktuellerIndex = -2, schleife = null;

  function bauen() {
    pixelProViertel = Math.max(26, element.clientWidth * (1 - NADEL_ANTEIL) / (2 * proTakt));
    const teile = [];
    for (let viertel = Math.floor(lied.zeilen[0]); viertel <= lied.laenge; viertel++) {
      const taktstrich = ((viertel % proTakt) + proTakt) % proTakt === 0;
      teile.push(`<i class="${taktstrich ? "taktstrich" : "schlagstrich"}" style="left:${viertel * pixelProViertel}px"></i>`);
    }
    lied.akkorde.forEach((akkord, i) => {
      teile.push(`<span class="block" data-index="${i}" style="left:${akkord.ab * pixelProViertel}px;width:${akkordDauer(lied, i) * pixelProViertel}px">${esc(transponiere(akkord.akk, halbtoene))}</span>`);
    });
    if (schleife) {
      teile.push(`<i class="wiederholung anfang" style="left:${schleife.von * pixelProViertel}px"></i>`,
        `<i class="wiederholung ende" style="left:${schleife.bis * pixelProViertel}px"></i>`);
    }
    streifen.innerHTML = teile.join("");
    aktuellerIndex = -2;
  }

  bauen();
  return {
    neuBauen: bauen,
    schleifeZeigen(neueSchleife) { schleife = neueSchleife; bauen(); },
    zeigen(position) {
      const nadel = element.clientWidth * NADEL_ANTEIL;
      streifen.style.transform = `translate3d(${nadel - position * pixelProViertel}px,0,0)`;
      const index = position < 0 ? -1 : lied.akkorde.indexOf(akkordBei(lied, position));
      /* Der Name des laufenden Akkords bleibt an der Nadel stehen, statt links hinauszulaufen,
         und kurz vor dem Wechsel am rechten Ende des Blocks, statt aus ihm herauszufallen */
      const laufender = streifen.querySelector(".block.jetzt");
      if (laufender) {
        const anNadel = (position - lied.akkorde[index].ab) * pixelProViertel + 10;
        const amEnde = akkordDauer(lied, index) * pixelProViertel - NAMENSBREITE;
        laufender.style.paddingLeft = `${Math.max(10, Math.min(anNadel, amEnde))}px`;
      }
      if (index === aktuellerIndex) return;
      aktuellerIndex = index;
      streifen.querySelectorAll(".block").forEach((block) => {
        const i = Number(block.dataset.index);
        if (i !== index) block.style.paddingLeft = "";
        block.classList.toggle("jetzt", i === index);
        block.classList.toggle("dann", i === index + 1);
        block.classList.toggle("vorbei", i < index);
      });
    },
  };
}

/* ---------- Griff jetzt und gleich ----------
   Neben dem laufenden Griff steht der naechste schon als kleines Griffbild, damit die Hand weiss, wohin sie muss.
   Im letzten Schlag vor dem Wechsel wird er hervorgehoben. */
export function griffAnlegen(element, lied, halbtoene) {
  const bild = element.querySelector(".griffbild"), name = element.querySelector(".akkname"), dann = element.querySelector(".dann");
  const bildDann = element.querySelector(".griffbild-dann");
  let gezeigt = null, gezeigtDann = "", gezeigterNaechster = undefined;
  return {
    zeigen(position) {
      const ab = Math.max(position, 0);
      const jetzt = transponiere(akkordBei(lied, ab).akk, halbtoene);
      const naechster = naechsterAkkord(lied, ab);
      const naechsterName = naechster ? transponiere(naechster.akk, halbtoene) : null;
      if (jetzt !== gezeigt) {
        bild.innerHTML = griffbildSVG(jetzt, 1.25);
        name.textContent = jetzt;
        gezeigt = jetzt;
      }
      if (naechsterName !== gezeigterNaechster) {
        bildDann.innerHTML = naechsterName ? `<span class="dann-name">${esc(naechsterName)}</span>${griffbildSVG(naechsterName, 0.95)}` : "";
        bildDann.hidden = !naechsterName;
        gezeigterNaechster = naechsterName;
      }
      let text = "Schluss";
      if (naechster) {
        const schlaege = Math.ceil(naechster.ab - ab - 1e-6);
        text = `dann ${naechsterName} · in ${schlaege} ${schlaege === 1 ? "Schlag" : "Schlägen"}`;
        bildDann.classList.toggle("bald", position >= 0 && naechster.ab - position <= 1);
      }
      if (text !== gezeigtDann) { dann.textContent = text; gezeigtDann = text; }
    },
  };
}

/* ---------- Liedtext ---------- */
export function textAnlegen(element, lied, halbtoene) {
  const [vorige, aktuelle, kommende] = ["vorige", "aktuelle", "kommende"].map((name) => element.querySelector(`.${name}`));
  const mitText = lied.silben.length > 0;
  let gezeigteZeile = null, silbenElemente = [];

  function zeileHTML(index) {
    if (index < 0 || index >= lied.zeilen.length) return "";
    return mitText ? silbenHTML(index) : akkordzeileHTML(index);
  }
  /* Silben eines Wortes stehen in einer gemeinsamen Klammer: umgebrochen wird nur zwischen Woertern */
  function silbenHTML(index) {
    const silben = silbenDerZeile(lied, index), ende = zeilenEnde(lied, index);
    let html = "", wort = "";
    silben.forEach((silbe, i) => {
      const bis = silben[i + 1]?.ab ?? ende;
      const wechsel = lied.akkorde.find((akkord) => akkord.ab >= silbe.ab && akkord.ab < bis);
      const text = esc(silbe.text.replace(/-$/, ""));
      wort += `<span class="silbe" data-ab="${silbe.ab}" data-lang="${silbe.lang}">${wechsel ? `<b class="akk">${esc(transponiere(wechsel.akk, halbtoene))}</b>` : ""}<span class="t">${text}</span><span class="f" aria-hidden="true">${text}</span></span>`;
      if (!silbe.text.endsWith("-") || i === silben.length - 1) {
        html += `<span class="wort">${wort}</span> `;
        wort = "";
      }
    });
    return html;
  }
  /* Geschuetzte Lieder ohne Text: die Akkordfolge der Zeile, jeder Wechsel ein Wort */
  function akkordzeileHTML(index) {
    const von = lied.zeilen[index], bis = zeilenEnde(lied, index);
    const folge = [akkordBei(lied, von), ...lied.akkorde.filter((akkord) => akkord.ab > von && akkord.ab < bis)];
    return folge.map((akkord) => {
      const name = esc(transponiere(akkord.akk, halbtoene));
      const ab = Math.max(akkord.ab, von), lang = Math.min(bis, naechsterAkkord(lied, akkord.ab)?.ab ?? bis) - ab;
      return `<span class="silbe nurakkord" data-ab="${ab}" data-lang="${lang}"><span class="t">${name}</span><span class="f" aria-hidden="true">${name}</span></span> `;
    }).join("");
  }

  return {
    neuBauen() { gezeigteZeile = null; },
    zeigen(position) {
      const zeile = zeileBei(lied, position);
      if (zeile !== gezeigteZeile) {
        vorige.innerHTML = zeileHTML(zeile - 1);
        aktuelle.innerHTML = zeileHTML(zeile);
        kommende.innerHTML = zeileHTML(zeile + 1);
        silbenElemente = [...aktuelle.querySelectorAll(".silbe")].map((el) => ({ el, ab: Number(el.dataset.ab), lang: Number(el.dataset.lang) }));
        gezeigteZeile = zeile;
      }
      for (const silbe of silbenElemente) {
        const anteil = Math.min(Math.max((position - silbe.ab) / silbe.lang, 0), 1);
        silbe.el.style.setProperty("--fuellung", `${(anteil * 100).toFixed(1)}%`);
      }
    },
  };
}

/* ---------- Schlagmuster ---------- */
export function schlagAnlegen(element, muster) {
  const zeichen = { D: ["ab", "abwärts"], U: ["auf", "aufwärts"], x: ["chunk", "Chunk"], "-": ["pausenschlag", "Pause"] };
  element.innerHTML = muster.schlaege.map((schlag) => `<span class="zelle">${symbol(...zeichen[schlag])}</span>`).join("");
  const zellen = [...element.children];
  let aktiv = -2;
  return {
    zeigen(position) {
      const achtel = position < 0 ? -1 : Math.floor(position * 2 + 1e-6) % zellen.length;
      if (achtel === aktiv) return;
      zellen[aktiv]?.classList.remove("an");
      zellen[achtel]?.classList.add("an");
      aktiv = achtel;
    },
  };
}
