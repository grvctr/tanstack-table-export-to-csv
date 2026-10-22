const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createTable, getCoreRowModel } = require("@tanstack/react-table");

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
  getVisibleCells: () =>
    values.map((value, index) => ({
      column: { id: String(index) },
      getValue: () => value,
    })),
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

test("supports delimiter, BOM, and custom cell formatting", async () => {
  const blob = getCsvBlob(
    [header("name", "Name"), header("amount", "Amount")],
    [row("Ada", 12.5)],
    {
      delimiter: ";",
      includeBom: true,
      formatCell: (value, cell) =>
        cell.column.id === "1" ? `${value}; EUR` : value,
    }
  );

  const bytes = Buffer.from(await blob.arrayBuffer());
  assert.equal(bytes.subarray(0, 3).toString("hex"), "efbbbf");
  assert.equal(
    bytes.subarray(3).toString(),
    'Name;Amount\r\nAda;"12.5; EUR"\r\n'
  );
});

test("optionally prevents formula injection without changing numbers", async () => {
  const blob = getCsvBlob(
    [header("value", "Value")],
    [row("=1+1"), row(-1), row("-1")],
    { preventFormulaInjection: true }
  );

  assert.equal(await blob.text(), "Value\r\n'=1+1\r\n-1\r\n'-1\r\n");
});

test("works with a real TanStack Table instance", async () => {
  const table = createTable({
    data: [{ name: "Ada", age: 36, secret: "hidden" }],
    columns: [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "age", header: "Age" },
      { accessorKey: "secret", header: "Secret" },
    ],
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder: [],
      columnPinning: { left: [], right: [] },
      columnVisibility: { secret: false },
    },
    onStateChange() {},
    renderFallbackValue: null,
  });
  const headers = table
    .getHeaderGroups()
    .flatMap((group) => group.headers);

  const blob = getCsvBlob(headers, table.getCoreRowModel().rows);

  assert.equal(await blob.text(), "Name,Age\r\nAda,36\r\n");
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
