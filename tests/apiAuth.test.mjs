import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import api from "../src/api.ts";

function loadHooks(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports = {};
  runInNewContext(javascript, {
    exports,
    require: (name) => {
      if (name === "./api") return api;
      if (name === "@tanstack/react-query") {
        return {
          useQuery: (options) => options,
          useMutation: (options) => options,
          useQueryClient: () => ({ invalidateQueries: async () => {} }),
        };
      }
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports;
}

test("tenant and invoice requests use the current token", async () => {
  const previousStorage = globalThis.localStorage;
  const previousAdapter = api.defaults.adapter;
  let token = "first-token";
  const requests = [];
  globalThis.localStorage = { getItem: () => token };
  api.defaults.adapter = async (config) => {
    requests.push(config);
    return { data: { data: [] }, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const tenants = loadHooks("../src/useTenants.tsx");
    const invoices = loadHooks("../src/useInvoices.tsx");
    await tenants.useTenants().queryFn();
    await tenants.useTenantsById(4).queryFn();
    await invoices.useInvoicesByTenantId(4).queryFn();
    await invoices.useInvoicesById(7).queryFn();
    await invoices.useInvoicesCreate().mutationFn({
      tenant_id: 4, prev_date: "2026-01-01", prev_reading: 1,
      curr_date: "2026-02-01", curr_reading: 2,
    });
    assert.deepEqual(requests.map((request) => request.url), [
      "/tenants", "/tenants/4", "/invoices", "/invoices/7", "/invoices",
    ]);
    for (const request of requests) {
      assert.equal(request.baseURL, "http://127.0.0.1:8000/api");
      assert.equal(request.headers.get("Authorization"), "Bearer first-token");
    }
    token = "new-token";
    await tenants.useTenants().queryFn();
    assert.equal(requests.at(-1).headers.get("Authorization"), "Bearer new-token");
    token = null;
    await tenants.useTenants().queryFn();
    assert.equal(requests.at(-1).headers.has("Authorization"), false);
  } finally {
    api.defaults.adapter = previousAdapter;
    globalThis.localStorage = previousStorage;
  }
});
