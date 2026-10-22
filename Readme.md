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

The filename receives a `.csv` extension automatically. Pass a different row model to control what gets exported, for example `getCoreRowModel()` for all rows or `getSelectedRowModel()` for selected rows.

### Create a Blob without downloading

```ts
import { getCsvBlob } from "tanstack-table-export-to-csv";

const blob = getCsvBlob(headers, rows);
```

### Default import

The default export remains available for backwards compatibility:

```ts
import exportToCsv from "tanstack-table-export-to-csv";
```

## API

- `exportToCsv(fileName, headers, rows)` creates and downloads a CSV file.
- `getCsvBlob(headers, rows)` returns a `Blob` with MIME type `text/csv;charset=utf-8`.
- `getHeaderNames(headers)` returns the visible leaf-column names.

Fields containing commas, quotes, or line breaks are escaped according to standard CSV rules. Hidden columns, grouped headers, and placeholder headers are omitted.

## License

[MIT](LICENSE)
