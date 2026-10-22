import type { Cell, Header, Row } from "@tanstack/react-table";
import innerText from "react-innertext";

export type CsvOptions<TData> = {
  delimiter?: "," | ";" | "\t";
  includeBom?: boolean;
  preventFormulaInjection?: boolean;
  formatCell?: (value: unknown, cell: Cell<TData, unknown>) => unknown;
};

const escapeCsvValue = (
  value: unknown,
  delimiter: string,
  preventFormulaInjection: boolean
): string => {
  let text = value == null ? "" : String(value);
  if (
    preventFormulaInjection &&
    typeof value === "string" &&
    /^[=+\-@\t\r]/.test(text)
  ) {
    text = `'${text}`;
  }
  return text.includes(delimiter) || /["\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
};

export const getCsvBlob = <TData>(
  headers: Header<TData, unknown>[],
  rows: Row<TData>[],
  options: CsvOptions<TData> = {}
): Blob => {
  const {
    delimiter = ",",
    formatCell,
    includeBom = false,
    preventFormulaInjection = false,
  } = options;
  const data = [getHeaderNames(headers), ...getRowsData(rows, formatCell)];
  const csvContent = `${includeBom ? "\uFEFF" : ""}${data
    .map((row) =>
      row
        .map((value) =>
          escapeCsvValue(value, delimiter, preventFormulaInjection)
        )
        .join(delimiter)
    )
    .join("\r\n")}\r\n`;

  return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
};

export const exportToCsv = <TData>(
  fileName = "data",
  headers: Header<TData, unknown>[],
  rows: Row<TData>[],
  options: CsvOptions<TData> = {}
): void => {
  const blob = getCsvBlob(headers, rows, options);
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

const getRowsData = <TData>(
  rows: Row<TData>[],
  formatCell?: CsvOptions<TData>["formatCell"]
): unknown[][] =>
  rows.map((row) =>
    row
      .getVisibleCells()
      .map((cell) =>
        formatCell ? formatCell(cell.getValue(), cell) : cell.getValue()
      )
  );

export default exportToCsv;
