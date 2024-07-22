import { Header, Row } from "@tanstack/react-table";
export declare const getCsvBlob: (headers: Header<any, unknown>[], rows: Row<any>[]) => Blob;
declare const exportToCsv: (fileName: string, headers: Header<any, unknown>[], rows: Row<any>[]) => void;
export declare const getHeaderNames: (headers: Header<any, unknown>[]) => string[];
export default exportToCsv;
