import type { Header, Row } from "@tanstack/react-table";
export declare const getCsvBlob: <TData>(headers: Header<TData, unknown>[], rows: Row<TData>[]) => Blob;
export declare const exportToCsv: <TData>(fileName: string, headers: Header<TData, unknown>[], rows: Row<TData>[]) => void;
export declare const getHeaderNames: <TData>(headers: Header<TData, unknown>[]) => string[];
export default exportToCsv;
