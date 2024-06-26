# TANSTACK REACT TABLE EXPORT TO CSV 📊📤

## Installation

```bash
npm install tanstack-table-export-to-csv
```

or 

```bash
yarn add tanstack-table-export-to-csv
```

or 

```bash
pnpm add tanstack-table-export-to-csv
```

or

```bash
bun install tanstack-table-export-to-csv
```

## Usage

### `getCsvBlob`

The `getCsvBlob` function allows you to generate a Blob with CSV data, providing the flexibility to handle the export process on your own terms.

```typescript
import {
  createColumnHelper,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getCsvBlob } from "tanstack-table-export-to-csv";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
];
function App() {
  const [data, setData] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportToCsv = (): void => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getCoreRowModel().rows;

    const csvBlob = getCsvBlob(headers, rows);
  };

  return (
    <>
      <button onClick={handleExportToCsv}>Export to csv</button>
    </>
  );
}
```

### `exportToCsv`

The main powerhouse, `exportToCsv`, simplifies the process by creating a Blob and initiating the download.

```typescript
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { exportToCsv } from "tanstack-table-export-to-csv";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
];
function App() {
  const [data, setData] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExportToCsv = (): void => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getCoreRowModel().rows;

    exportToCsv("persons_data", headers, rows);
  };

  return (
    <>
      <button onClick={handleExportToCsv}>Export to csv</button>
    </>
  );
}
```

### `getHeaderNames`

A handy utility function, `getHeaderNames`, helps in obtaining text versions of headers.

```typescript
import {
  createColumnHelper,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getHeaderNames } from "tanstack-table-export-to-csv";

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
];

const table = useReactTable({
  data,
  columns,
  getFilteredRowModel: getFilteredRowModel(),
});

const headers = table
  .getHeaderGroups()
  .map((x) => x.headers)
  .flat();
const headerNames = getHeaderNames(headers);
// Result: ['firstName', 'Last Name', 'Age', 'Visits', 'Status', 'Profile Progress']
```

Feel free to contribute and make the `TANSTACK REACT TABLE EXPORT TO CSV` even more awesome! 🚀✨

## License

This module is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
