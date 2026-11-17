import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import api from "../src/api.ts";

function createLogout(client, navigate) {
  const source = readFileSync(new URL("../src/useAuth.tsx", import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports = {};
  runInNewContext(javascript, {
    exports,
    localStorage: globalThis.localStorage,
    require: (name) => {
      if (name === "./api") return api;
      if (name === "react-router-dom") return { useNavigate: () => navigate };
      if (name === "@tanstack/react-query") {
        return { useQueryClient: () => client, useMutation: (options) => options };
      }
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports.useLogout();
}

test("logout posts the bearer token and clears the session only on success", async () => {
  const oldStorage = globalThis.localStorage;
  const oldAdapter = api.defaults.adapter;
  let token = "test-token";
  const events = [];
  globalThis.localStorage = {
    getItem: () => token,
    removeItem: (key) => { assert.equal(key, "token"); token = null; events.push("remove"); },
  };
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, "/logout");
    assert.equal(config.method, "post");
    assert.equal(config.headers.get("Authorization"), "Bearer test-token");
    assert.equal(config.data, undefined);
    return { data: {}, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const mutation = createLogout({
      cancelQueries: async () => { events.push("cancel"); },
      clear: () => { events.push("clear"); },
    }, (path, options) => {
      assert.equal(path, "/login");
      assert.equal(options.replace, true);
      events.push("navigate");
    });
    await mutation.mutationFn();
    assert.equal(token, "test-token");
    await mutation.onSuccess();
    assert.equal(token, null);
    assert.deepEqual(events, ["cancel", "remove", "clear", "navigate"]);
  } finally {
    api.defaults.adapter = oldAdapter;
    globalThis.localStorage = oldStorage;
  }
});

test("a failed logout request propagates the error without clearing the session", async () => {
  const oldStorage = globalThis.localStorage;
  const oldAdapter = api.defaults.adapter;
  let token = "test-token";
  globalThis.localStorage = {
    getItem: () => token,
    removeItem: () => { token = null; },
  };
  api.defaults.adapter = async () => { throw new Error("Network error"); };
  try {
    const mutation = createLogout({
      cancelQueries: () => assert.fail("Should not cancel queries"),
      clear: () => assert.fail("Should not clear cache"),
    }, () => assert.fail("Should not navigate"));
    await assert.rejects(mutation.mutationFn(), /Network error/);
    assert.equal(token, "test-token");
  } finally {
    api.defaults.adapter = oldAdapter;
    globalThis.localStorage = oldStorage;
  }
});
