import test from "node:test";
import assert from "node:assert/strict";
import { parseTagNamesFromFormData } from "./validators";

test("parseTagNamesFromFormData keeps every selected checkbox value", () => {
  const formData = new FormData();
  formData.append("tags", "bahasa");
  formData.append("tags", "budaya");
  formData.append("tags", "jlpt");

  assert.deepEqual(parseTagNamesFromFormData(formData), ["bahasa", "budaya", "jlpt"]);
});

test("parseTagNamesFromFormData ignores empty and comma-separated values", () => {
  const formData = new FormData();
  formData.append("tags", "bahasa, budaya,");
  formData.append("tags", "");
  formData.append("tags", "mext");

  assert.deepEqual(parseTagNamesFromFormData(formData), ["bahasa", "budaya", "mext"]);
});
