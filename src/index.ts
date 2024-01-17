import { Header, Row } from "@tanstack/react-table";
import innerText from "react-innertext";

const getCsvBlob = (
  headers: Header<any, unknown>[],
  rows: Row<any>[]
): Blob => {
  let csvContent = "";
  const headerNames = getHeaderNames(headers);
  csvContent += headerNames.join(",") + "\n";

  const data = getRowsData(rows);
  data.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  return new Blob([csvContent], { type: "text/csv" });
};

const exportToCsv = (
  fileName = "data",
  headers: Header<any, unknown>[],
  rows: Row<any>[]
): void => {
  const blob = getCsvBlob(headers, rows);
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const getHeaderNames = (headers: Header<any, unknown>[]): string[] =>
  headers.map((header) => {
    if (typeof header.column.columnDef.header === "function") {
      const headerContext = header.column.columnDef.header(header.getContext());
      if (typeof headerContext === "string") {
        return headerContext;
      }
      return innerText(headerContext);
    } else {
      return header.column.columnDef.header ?? header.id;
    }
  });

const getRowsData = (rows: Row<any>[]): string[][] => {
  return rows.map((row: Row<any>) => {
    const cells = row.getAllCells();
    const cellsConent = cells.map((x) => x.getValue() as string);
    return cellsConent;
  });
};

export = { exportToCsv, getCsvBlob, getHeaderNames };
