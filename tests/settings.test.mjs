import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/Settings.tsx", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

function setup() {
  const states = [];
  let index = 0;
  let query = { isLoading: true };
  let submitted;
  let mutation = { isPending: false, mutate: (payload) => { submitted = payload; } };
  const exports = {};
  runInNewContext(javascript, {
    exports,
    require: (name) => {
      if (name === "react") return {
        useState: (initial) => {
          const current = index++;
          if (!(current in states)) states[current] = initial;
          return [states[current], (value) => { states[current] = value; }];
        },
      };
      if (name === "react-router-dom") return { useNavigate: () => () => {} };
      if (name === "./useSettings") return {
        useSettings: () => query,
        useSettingsCreate: () => mutation,
      };
      if (name === "./Button") return () => null;
      return require(name);
    },
  });
  return {
    render: () => { index = 0; return exports.default(); },
    setQuery: (value) => { query = value; },
    setMutation: (value) => { mutation = value; },
    submitted: () => submitted,
  };
}

function find(element, predicate) {
  if (!element || typeof element !== "object") return undefined;
  if (predicate(element)) return element;
  const children = element.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const result = find(child, predicate);
    if (result) return result;
  }
}

test("refresh loads settings, preserves edits on refetch, and submits shown values", () => {
  const app = setup();
  assert.equal(app.render().props.children, "Loading settings...");
  const settings = {
    tenant_id: 0, water_rate: 10, electricity_rate: 11,
    internet_lowspeed_rate: 12, internet_highspeed_rate: 13, parking_rate: 14,
  };
  app.setQuery({ data: settings });
  let page = app.render();
  const input = (id) => find(page, (element) => element.type === "input" && element.props.id === id);
  for (const [id, value] of [
    ["water_rate", 10], ["electricity_rate", 11], ["internet_lowspeed", 12],
    ["internet_highspeed", 13], ["parking_rate", 14],
  ]) assert.equal(input(id).props.value, value);
  input("water_rate").props.onChange({ target: { value: "25" } });
  app.setQuery({ data: { ...settings, water_rate: 99, parking_rate: 15 } });
  page = app.render();
  assert.equal(input("water_rate").props.value, 25);
  assert.equal(input("parking_rate").props.value, 15);
  find(page, (element) => element.type === "form").props.onSubmit({ preventDefault() {} });
  assert.deepEqual({ ...app.submitted() }, { ...settings, water_rate: 25, parking_rate: 15 });
});

test("reports loading and save failures", () => {
  const app = setup();
  app.setQuery({ isError: true, error: new Error("offline") });
  assert.match(app.render().props.children.join(""), /offline/);
  app.setQuery({ data: {
    tenant_id: 0, water_rate: 1, electricity_rate: 1, internet_lowspeed_rate: 1,
    internet_highspeed_rate: 1, parking_rate: 1,
  } });
  app.setMutation({ isPending: false, isError: true, error: new Error("save failed") });
  assert.ok(find(app.render(), (element) => element.props?.role === "alert"));
});

test("shows defaults and submits edited values when settings are missing", () => {
  const app = setup();
  app.setQuery({ data: null, isLoading: false, isError: false });
  let page = app.render();
  const input = (id) => find(page, (element) => element.type === "input" && element.props.id === id);
  for (const id of ["water_rate", "electricity_rate", "internet_lowspeed", "internet_highspeed", "parking_rate"]) {
    assert.equal(input(id).props.value, 0);
  }
  input("water_rate").props.onChange({ target: { value: "25" } });
  page = app.render();
  find(page, (element) => element.type === "form").props.onSubmit({ preventDefault() {} });
  assert.deepEqual({ ...app.submitted() }, {
    tenant_id: 0, water_rate: 25, electricity_rate: 0,
    internet_lowspeed_rate: 0, internet_highspeed_rate: 0, parking_rate: 0,
  });
});
