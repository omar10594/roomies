import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import * as schema from "./schema";

test("D1 preserves rent/payment types and supports the existing CRUD query patterns", async () => {
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    script: "export default { fetch() { return new Response('local test'); } };",
    compatibilityDate: "2026-10-22",
    d1Databases: { DB: "isolated-migration-test" },
  }));
  try {
    const binding = await runtime.getD1Database("DB");
    const ddl = await readFile(new URL("../../../schema.sql", import.meta.url), "utf8");
    for (const statement of ddl.split(";").filter((value) => value.trim())) {
      await binding.prepare(statement).run();
    }
    const db = drizzle(binding, { schema });
    await db.insert(schema.roomies).values({
      id: "fixture-tenant", name: "Migration fixture", slug: "migration-fixture",
      rentAmount: 650000, rentDay: 5, graceDays: 3, startDate: "2026-01-01",
      isActive: true, accessCode: null,
    });
    await db.insert(schema.payments).values({
      id: "fixture-payment", roomieId: "fixture-tenant", amount: 12345,
      date: "2026-10-22", note: null,
    });
    const tenants = await db.query.roomies.findMany();
    assert.equal(tenants[0].rentAmount, 650000);
    assert.equal(tenants[0].isActive, true);
    assert.equal(tenants[0].accessCode, null);
    const joined = await db.select({ payment: schema.payments, name: schema.roomies.name })
      .from(schema.payments).leftJoin(schema.roomies, eq(schema.payments.roomieId, schema.roomies.id));
    assert.equal(joined[0].payment.amount, 12345);
    assert.equal(joined[0].name, "Migration fixture");
    await db.update(schema.payments).set({ amount: 23456 }).where(eq(schema.payments.id, "fixture-payment"));
    assert.equal((await db.select().from(schema.payments))[0].amount, 23456);
    await db.delete(schema.payments).where(eq(schema.payments.roomieId, "fixture-tenant"));
    await db.delete(schema.roomies).where(eq(schema.roomies.id, "fixture-tenant"));
    assert.deepEqual(await db.query.roomies.findMany(), []);
    assert.deepEqual(await db.select().from(schema.payments), []);
  } finally {
    await runtime.dispose();
  }
});
