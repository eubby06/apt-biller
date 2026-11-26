import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/useSettings.tsx", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;

function queryFor(status, data) {
  const exports = {};
  runInNewContext(javascript, {
    exports,
    require: (name) => {
      if (name === "./api") return {
        get: async (_url, config) => {
          if (!config.validateStatus(status)) throw new Error(`HTTP ${status}`);
          return { status, data };
        },
      };
      if (name === "@tanstack/react-query") return { useQuery: (options) => options };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports.useSettings();
}

test("maps 404 to missing settings and preserves successful responses", async () => {
  assert.equal(await queryFor(404, { message: "Not found" }).queryFn(), null);
  assert.equal(await queryFor(200, { data: null }).queryFn(), null);
  const settings = { tenant_id: 0, water_rate: 5 };
  assert.equal(await queryFor(200, { data: settings }).queryFn(), settings);
});

test("does not suppress other HTTP errors", async () => {
  for (const status of [401, 403, 500]) {
    await assert.rejects(queryFor(status, {}).queryFn(), new RegExp(`HTTP ${status}`));
  }
});
