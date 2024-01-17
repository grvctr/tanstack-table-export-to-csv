import { Header, Row } from "@tanstack/react-table";
declare const _default: {
    exportToCsv: (fileName: string, headers: Header<any, unknown>[], rows: Row<any>[]) => void;
    getCsvBlob: (headers: Header<any, unknown>[], rows: Row<any>[]) => Blob;
    getHeaderNames: (headers: Header<any, unknown>[]) => string[];
};
export = _default;
