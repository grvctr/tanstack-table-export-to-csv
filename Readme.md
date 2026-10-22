# TanStack Table Export to CSV

[![npm](https://img.shields.io/npm/v/tanstack-table-export-to-csv)](https://www.npmjs.com/package/tanstack-table-export-to-csv)
[![CI](https://github.com/grvctr/tanstack-table-export-to-csv/actions/workflows/ci.yml/badge.svg)](https://github.com/grvctr/tanstack-table-export-to-csv/actions/workflows/ci.yml)

Export visible columns and any TanStack Table row model to a correctly escaped CSV file.

## Installation

```bash
npm install tanstack-table-export-to-csv
```

## Usage

```tsx
import { exportToCsv } from "tanstack-table-export-to-csv";

function ExportButton({ table }) {
  const exportRows = () => {
    const headers = table
      .getHeaderGroups()
      .flatMap((group) => group.headers);

    exportToCsv("people", headers, table.getFilteredRowModel().rows);
  };

  return <button onClick={exportRows}>Export CSV</button>;
}
```

The filename receives a `.csv` extension automatically. Choose the row model that matches the export:

- `table.getCoreRowModel().rows` exports all rows.
- `table.getFilteredRowModel().rows` exports filtered rows.
- `table.getRowModel().rows` exports the current page.
- `table.getSelectedRowModel().rows` exports selected rows.

### Create a Blob without downloading

```ts
import { getCsvBlob } from "tanstack-table-export-to-csv";

const blob = getCsvBlob(headers, rows);
```

### Excel, custom delimiters, and formatted values

Both `exportToCsv` and `getCsvBlob` accept the same optional fourth/third argument:

```ts
exportToCsv("people", headers, rows, {
  delimiter: ";",
  includeBom: true,
  preventFormulaInjection: true,
  formatCell: (value, cell) =>
    cell.column.id === "createdAt"
      ? new Date(String(value)).toLocaleDateString()
      : value,
});
```

- `delimiter` supports comma, semicolon, or tab. The default is comma.
- `includeBom` helps Excel detect UTF-8 text such as Cyrillic correctly.
- `preventFormulaInjection` prefixes dangerous string values with an apostrophe. Enable it when exported data can contain untrusted user input.
- `formatCell` formats dates, currencies, arrays, objects, or any other cell value.

### Default import

The default export remains available for backwards compatibility:

```ts
import exportToCsv from "tanstack-table-export-to-csv";
```

## API

- `exportToCsv(fileName, headers, rows, options?)` creates and downloads a CSV file.
- `getCsvBlob(headers, rows, options?)` returns a `Blob` with MIME type `text/csv;charset=utf-8`.
- `getHeaderNames(headers)` returns the visible leaf-column names.

Fields containing commas, quotes, or line breaks are escaped according to standard CSV rules. Hidden columns, grouped headers, and placeholder headers are omitted.

## License

[MIT](LICENSE)
