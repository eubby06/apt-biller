import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { QueryClient } from "@tanstack/react-query";

const require = createRequire(import.meta.url);

function loadHooks(path, client) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const axios = {
    get: async (url) => ({
      data: { data: url.includes("/tenants/") ? { id: 1, name: "Tenant" } : [{ id: 1 }] },
    }),
    post: async () => ({}),
  };
  const exports = {};
  runInNewContext(javascript, {
    exports,
    require: (name) => {
      if (name === "./api") return axios;
      if (name === "@tanstack/react-query") {
        return {
          useQuery: (options) => options,
          useMutation: (options) => options,
          useQueryClient: () => client,
        };
      }
      return require(name);
    },
  });
  return exports;
}

test("tenant detail and invoice list with the same id use separate cache entries", async () => {
  for (const invoiceFirst of [true, false]) {
    const client = new QueryClient();
    const tenantHooks = loadHooks("../src/useTenants.tsx", client);
    const invoiceHooks = loadHooks("../src/useInvoices.tsx", client);
    const tenantQuery = tenantHooks.useTenantsById(1);
    const invoiceQuery = invoiceHooks.useInvoicesByTenantId(1);
    const queries = invoiceFirst
      ? [invoiceQuery, tenantQuery]
      : [tenantQuery, invoiceQuery];
    for (const query of queries) await client.fetchQuery(query);
    assert.equal(client.getQueryData(tenantQuery.queryKey).name, "Tenant");
    assert.equal(Array.isArray(client.getQueryData(invoiceQuery.queryKey)), true);

    await invoiceHooks.useInvoicesCreate().onSuccess();
    assert.equal(client.getQueryState(invoiceQuery.queryKey).isInvalidated, true);
    assert.equal(client.getQueryState(tenantQuery.queryKey).isInvalidated, false);
    client.clear();
  }
});
