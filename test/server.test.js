import { test } from "node:test";
import assert from "node:assert/strict";
import { dateiFuer, serverStarten } from "../server/server.js";

test("Pfade bleiben in ihrem Ordner", () => {
  assert.match(dateiFuer("/"), /app[\\/]index\.html$/);
  assert.match(dateiFuer("/lieder/entchen.json"), /lieder[\\/]entchen\.json$/);
  assert.equal(dateiFuer("/../package.json"), dateiFuer("/package.json"), "../ am Anfang wird von URL aufgeloest");
  assert.equal(dateiFuer("/lieder/..%2F..%2Fpackage.json"), null, "kodierte Schraegstriche duerfen nicht hinaus");
  assert.match(dateiFuer("/%2E%2E/%2E%2E/package.json"), /app[\\/]package\.json$/, "kodierte Punkte loest URL auf, es bleibt in app/");
});

test("Liederliste und ein Lied kommen aus dem Server", async () => {
  const server = await serverStarten(0);
  const adresse = `http://127.0.0.1:${server.address().port}`;
  try {
    const liste = await (await fetch(`${adresse}/api/lieder`)).json();
    assert.ok(liste.length >= 42);
    assert.ok(liste.every((lied) => lied.id && lied.titel && typeof lied.mitText === "boolean"));
    const entchen = await fetch(`${adresse}/lieder/entchen.json`);
    assert.equal(entchen.status, 200);
    assert.equal((await entchen.json()).id, "entchen");
    assert.equal((await fetch(`${adresse}/gibtsnicht.js`)).status, 404);
  } finally {
    server.close();
  }
});
