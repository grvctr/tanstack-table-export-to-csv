import type { Header, Row } from "@tanstack/react-table";
import innerText from "react-innertext";

const escapeCsvValue = (value: unknown): string => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const getCsvBlob = <TData>(
  headers: Header<TData, unknown>[],
  rows: Row<TData>[]
): Blob => {
  const data = [getHeaderNames(headers), ...getRowsData(rows)];
  const csvContent = `${data
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n")}\r\n`;

  return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
};

export const exportToCsv = <TData>(
  fileName = "data",
  headers: Header<TData, unknown>[],
  rows: Row<TData>[]
): void => {
  const blob = getCsvBlob(headers, rows);
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute(
    "download",
    /\.csv$/i.test(fileName) ? fileName : `${fileName}.csv`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getHeaderNames = <TData>(
  headers: Header<TData, unknown>[]
): string[] =>
  headers
    .filter(
      (header) =>
        !header.isPlaceholder &&
        header.subHeaders.length === 0 &&
        header.column.getIsVisible()
    )
    .map((header) => {
      if (typeof header.column.columnDef.header === "function") {
        const headerContext = header.column.columnDef.header(
          header.getContext()
        );
        if (typeof headerContext === "string") {
          return headerContext;
        }
        return innerText(headerContext);
      }
      return header.column.columnDef.header ?? header.id;
    });

const getRowsData = <TData>(rows: Row<TData>[]): unknown[][] =>
  rows.map((row) => row.getVisibleCells().map((cell) => cell.getValue()));

export default exportToCsv;
