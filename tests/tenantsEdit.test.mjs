import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/TenantsEdit.tsx", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

function renderEdit(result, id = "4") {
  const exports = {};
  const TenantForm = () => null;
  runInNewContext(javascript, {
    exports,
    require: (name) => {
      if (name === "react") return { useState: (value) => [value, () => {}] };
      if (name === "react-router-dom") {
        return { useNavigate: () => () => {}, useParams: () => ({ tenantId: id }) };
      }
      if (name === "./useTenants") {
        return { useTenantsCreate: () => ({}), useTenantsById: () => result };
      }
      if (name === "./TenantForm") return TenantForm;
      return require(name);
    },
  });
  return { element: exports.default(), TenantForm };
}

test("waits for tenant before mounting the form and fills it after fetch", () => {
  const loading = renderEdit({ isLoading: true });
  assert.equal(loading.element.props.children, "Loading tenant...");

  const tenant = {
    id: 4, name: "Alex", unit: 2, move_in_date: "2026-03-01 12:00:00",
    total_heads: 3, rent_amount: 7500, internet_plan: "high_speed",
  };
  const { element, TenantForm } = renderEdit({ data: tenant, isLoading: false, isError: false });
  const form = element.props.children[1];
  assert.equal(form.type, TenantForm);
  assert.equal(form.key, "4");
  assert.equal(form.props.initialData.name, "Alex");
  assert.equal(form.props.initialData.move_in_date, "2026-03-01");
  assert.equal(form.props.initialData.unit, 2);
  assert.equal(form.props.initialData.total_heads, 3);
  assert.equal(form.props.initialData.rent_amount, 7500);
  assert.equal(form.props.initialData.internet_plan, "high_speed");
});

test("shows errors for invalid IDs, failed requests and missing tenants", () => {
  assert.equal(renderEdit({}, "abc").element.props.children, "Invalid tenant ID.");
  assert.match(renderEdit({ isError: true, error: new Error("offline") }).element.props.children.join(""), /offline/);
  assert.equal(renderEdit({}).element.props.children, "Tenant not found.");
});
