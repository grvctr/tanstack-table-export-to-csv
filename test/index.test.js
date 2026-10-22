const assert = require("node:assert/strict");
const { test } = require("node:test");

const { exportToCsv, getCsvBlob, getHeaderNames } = require("../index.js");

const header = (id, label = id, options = {}) => ({
  id,
  isPlaceholder: options.isPlaceholder ?? false,
  subHeaders: options.subHeaders ?? [],
  column: {
    columnDef: { header: label },
    getIsVisible: () => options.visible ?? true,
  },
  getContext: () => ({}),
});

const row = (...values) => ({
  getVisibleCells: () => values.map((value) => ({ getValue: () => value })),
});

test("creates valid CSV for commas, quotes, newlines, and empty values", async () => {
  const blob = getCsvBlob(
    [header("name", "Full name"), header("note", "Note")],
    [row('Ada, "Lovelace"', "line 1\nline 2"), row(null, undefined)]
  );

  assert.equal(blob.type, "text/csv;charset=utf-8");
  assert.equal(
    await blob.text(),
    'Full name,Note\r\n"Ada, ""Lovelace""","line 1\nline 2"\r\n,\r\n'
  );
});

test("uses only visible leaf headers", () => {
  assert.deepEqual(
    getHeaderNames([
      header("group", "Group", { subHeaders: [header("name")] }),
      header("placeholder", "Placeholder", { isPlaceholder: true }),
      header("hidden", "Hidden", { visible: false }),
      header("name", "Name"),
    ]),
    ["Name"]
  );
});

test("downloads a .csv file and releases its object URL", () => {
  const calls = [];
  const link = {
    setAttribute: (name, value) => calls.push([name, value]),
    click: () => calls.push("click"),
    remove: () => calls.push("remove"),
  };

  global.document = {
    createElement: () => link,
    body: { appendChild: () => calls.push("append") },
  };
  global.window = {
    URL: {
      createObjectURL: () => "blob:test",
      revokeObjectURL: (url) => calls.push(["revoke", url]),
    },
  };

  exportToCsv("people", [header("name", "Name")], [row("Ada")]);

  assert.deepEqual(calls, [
    ["download", "people.csv"],
    "append",
    "click",
    "remove",
    ["revoke", "blob:test"],
  ]);
});
