import type { Cell, Header, Row } from "@tanstack/react-table";
export type CsvOptions<TData> = {
    delimiter?: "," | ";" | "\t";
    includeBom?: boolean;
    preventFormulaInjection?: boolean;
    formatCell?: (value: unknown, cell: Cell<TData, unknown>) => unknown;
};
export declare const getCsvBlob: <TData>(headers: Header<TData, unknown>[], rows: Row<TData>[], options?: CsvOptions<TData>) => Blob;
export declare const exportToCsv: <TData>(fileName: string, headers: Header<TData, unknown>[], rows: Row<TData>[], options?: CsvOptions<TData>) => void;
export declare const getHeaderNames: <TData>(headers: Header<TData, unknown>[]) => string[];
export default exportToCsv;
