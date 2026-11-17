import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadModule(path, dependencies, storage) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const exports = {};
  runInNewContext(javascript, {
    exports,
    localStorage: storage,
    require: (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

test("successful login stores token, clears cached data and redirects", async () => {
  let mutation;
  let removed = false;
  let destination;
  let request;
  const values = new Map();
  const storage = {
    setItem: (key, value) => values.set(key, value),
    getItem: (key) => values.get(key) ?? null,
  };
  const login = loadModule("../src/Login.tsx", {
    react: { useState: () => ["", () => {}] },
    "react/jsx-runtime": { jsx: () => null, jsxs: () => null, Fragment: Symbol() },
    "@tanstack/react-query": {
      useQueryClient: () => ({ removeQueries: () => { removed = true; } }),
      useMutation: (options) => { mutation = options; return { isError: false }; },
    },
    "react-router-dom": { useNavigate: () => (...args) => { destination = args; } },
    axios: { post: async (...args) => { request = args; return { data: { token: "test-token" } }; } },
  }, storage);

  login.default();
  await mutation.mutationFn();
  mutation.onSuccess();
  assert.equal(request[0], "http://127.0.0.1:8000/api/login");
  assert.equal(storage.getItem("token"), "test-token");
  assert.equal(removed, true);
  assert.equal(destination[0], "/");
  assert.equal(destination[1].replace, true);
});

test("login rejects a response without a token", async () => {
  let mutation;
  const login = loadModule("../src/Login.tsx", {
    react: { useState: () => ["", () => {}] },
    "react/jsx-runtime": { jsx: () => null, jsxs: () => null, Fragment: Symbol() },
    "@tanstack/react-query": {
      useQueryClient: () => ({}),
      useMutation: (options) => { mutation = options; return { isError: false }; },
    },
    "react-router-dom": { useNavigate: () => () => {} },
    axios: { post: async () => ({ data: {} }) },
  }, { setItem: () => assert.fail("Invalid token must not be stored") });
  login.default();
  await assert.rejects(mutation.mutationFn(), /valid token/);
});

test("user query sends the token to the API port and is disabled without one", async () => {
  let request;
  let token = "test-token";
  const hooks = loadModule("../src/useUser.tsx", {
    "@tanstack/react-query": { useQuery: (options) => options },
    axios: { get: async (...args) => { request = args; return { data: { id: 1 } }; } },
  }, { getItem: () => token });
  const query = hooks.useUser();
  assert.equal(query.enabled, true);
  await query.queryFn();
  assert.equal(request[0], "http://127.0.0.1:8000/api/user");
  assert.equal(request[1].headers.Authorization, "Bearer test-token");
  token = null;
  assert.equal(hooks.useUser().enabled, false);
});
