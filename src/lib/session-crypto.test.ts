import assert from "node:assert/strict";
import test from "node:test";
import { hashPin, newSessionToken, sessionHash, validPin, validSessionToken, verifyPin } from "./session-crypto";

test("admin PIN accepts exactly four numeric characters, including leading zeroes", () => {
  assert.equal(validPin("0001"), true);
  for (const value of [null, {}, "", "123", "12345", "12a4", "１２３４", " 1234"]) assert.equal(validPin(value), false);
});

test("salted PIN hashes verify correctly and reject malformed or legacy plain values", async () => {
  const first = await hashPin("0001");
  const second = await hashPin("0001");
  assert.notEqual(first, second);
  assert.equal(await verifyPin("0001", first), true);
  assert.equal(await verifyPin("0002", first), false);
  assert.equal(await verifyPin("0001", "0001"), false);
  assert.equal(await verifyPin("0001", "pbkdf2:999999999999:invalid:invalid"), false);
});

test("session credentials are unpredictable opaque values and only digests are persisted", async () => {
  const first = newSessionToken();
  assert.equal(validSessionToken(first), true);
  assert.notEqual(first, newSessionToken());
  assert.notEqual(await sessionHash(first), first);
  assert.equal(await sessionHash(first), await sessionHash(first));
  for (const forged of ["verified", "", "x".repeat(64), null]) assert.equal(validSessionToken(forged), false);
});
