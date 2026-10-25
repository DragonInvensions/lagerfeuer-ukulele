import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { qrMatrix } from "../app/kern/qr.js";

const version = (text) => (qrMatrix(text).length - 17) / 4;
const fingerabdruck = (text) => createHash("sha256").update(qrMatrix(text).flat().map(Number).join("")).digest("hex");

test("Version nach der Byte-Kapazitaet der Norm (Fehlerkorrektur M)", () => {
  /* ISO/IEC 18004, Tabelle 7: so viele Byte passen in Version 1 bis 10 */
  const kapazitaet = [14, 26, 42, 62, 84, 106, 122, 152, 180, 213];
  kapazitaet.forEach((bytes, i) => {
    assert.equal(version("x".repeat(bytes)), i + 1, `${bytes} Byte`);
    if (i < 9) assert.equal(version("x".repeat(bytes + 1)), i + 2, `${bytes + 1} Byte`);
  });
  assert.throws(() => qrMatrix("x".repeat(214)), /zu lang/);
});

test("Umlaute zaehlen als UTF-8-Bytes", () => {
  assert.equal(version("ä".repeat(7)), 1);
  assert.equal(version("ä".repeat(8)), 2);
});

test("Referenzcodes bleiben Modul fuer Modul gleich", () => {
  /* Am 25.10.2026 gegengeprueft: beide OpenCV-Leser (klassisch und Aruco) lesen die Codes, und OpenCVs eigener
     Erzeuger liefert bei derselben Maske dieselbe Matrix (Version 5 bis auf ein Restbit ohne Daten). */
  assert.equal(fingerabdruck("https://ukulele.167-233-249-92.sslip.io/#/mitsingen/00112233445566778899aabbccddeeff"),
    "be2deeef0cefb37f8390b14a6af55e0824f30aea63e24fb2753b293cb27fa0ea");
  assert.equal(fingerabdruck("Kumbaya, my Lord. Hejo, spann den Wagen an! Ein Männlein steht im Walde. ".repeat(3).slice(0, 200) + "äöü"),
    "6a9c1107ad3c3d41d551cf3fd0fc73a3650009e2d3712029adf6b881c20e538d");
});

test("Suchmuster in drei Ecken, Taktlinien abwechselnd", () => {
  const m = qrMatrix("Lagerfeuer"), n = m.length;
  for (const [x0, y0] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
    for (let i = 0; i < 7; i++) {
      assert.equal(m[y0][x0 + i], true);
      assert.equal(m[y0 + 6][x0 + i], true);
      assert.equal(m[y0 + 3][x0 + 3], true);
      assert.equal(m[y0 + 1][x0 + 1], false);
    }
  }
  for (let i = 8; i < n - 8; i++) {
    assert.equal(m[6][i], i % 2 === 0);
    assert.equal(m[i][6], i % 2 === 0);
  }
});
