import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("SelectTrigger avoids line-clamp so Activity restoration repaints its value", async () => {
  const source = await readFile(new URL("./select.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(source, /\[&>span\]:line-clamp/);
  assert.match(source, /\[&>span\]:truncate/);
});

test("payment forms use native selects that survive Activity restoration", async () => {
  const source = await readFile(
    new URL("../../app/admin/payments/page.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(source.match(/<select/g)?.length, 2);
  assert.equal(source.match(/className="block h-9 w-full/g)?.length, 2);
  assert.match(source, /function useSelectRepaint/);
  assert.equal(source.match(/useSelectRepaint\(/g)?.length, 3);
  assert.doesNotMatch(source, /<SelectTrigger/);
});
