import assert from "node:assert/strict";
import test from "node:test";
import { isAlmostDue } from "../src/dueDate.ts";

test("includes today and the next two days, but not yesterday or three days ahead", () => {
  const today = new Date(2026, 10, 11, 23, 45);
  assert.equal(isAlmostDue("11-10", today), false);
  assert.equal(isAlmostDue("11-11", today), true);
  assert.equal(isAlmostDue("11-12", today), true);
  assert.equal(isAlmostDue("11-13", today), true);
  assert.equal(isAlmostDue("11-14", today), false);
});

test("handles month and year boundaries", () => {
  assert.equal(isAlmostDue("12-01", new Date(2026, 10, 30)), true);
  assert.equal(isAlmostDue("01-01", new Date(2026, 11, 30)), true);
  assert.equal(isAlmostDue("01-01", new Date(2026, 11, 29)), false);
});

test("treats February 29 as due only in a leap year", () => {
  assert.equal(isAlmostDue("02-29", new Date(2028, 1, 27)), true);
  assert.equal(isAlmostDue("02-29", new Date(2028, 1, 29)), true);
  assert.equal(isAlmostDue("02-29", new Date(2027, 1, 27)), false);
});

test("reports invalid dates", () => {
  for (const date of ["2-09", "2026-02-09", "00-01", "13-01", "04-31", "02-30", ""]) {
    assert.equal(isAlmostDue(date, new Date(2026, 0, 1)), null);
  }
});
