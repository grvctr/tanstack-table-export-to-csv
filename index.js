"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeaderNames = exports.getCsvBlob = void 0;
var react_innertext_1 = require("react-innertext");
var getCsvBlob = function (headers, rows) {
    var csvContent = "";
    var headerNames = (0, exports.getHeaderNames)(headers);
    csvContent += headerNames.join(",") + "\n";
    var data = getRowsData(rows);
    data.forEach(function (row) {
        csvContent += row.join(",") + "\n";
    });
    return new Blob([csvContent], { type: "text/csv" });
};
exports.getCsvBlob = getCsvBlob;
var exportToCsv = function (fileName, headers, rows) {
    if (fileName === void 0) { fileName = "data"; }
    var blob = (0, exports.getCsvBlob)(headers, rows);
    var link = document.createElement("a");
    var url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
var getHeaderNames = function (headers) {
    return headers.map(function (header) {
        var _a;
        if (typeof header.column.columnDef.header === "function") {
            var headerContext = header.column.columnDef.header(header.getContext());
            if (typeof headerContext === "string") {
                return headerContext;
            }
            return (0, react_innertext_1.default)(headerContext);
        }
        else {
            return (_a = header.column.columnDef.header) !== null && _a !== void 0 ? _a : header.id;
        }
    });
};
exports.getHeaderNames = getHeaderNames;
var getRowsData = function (rows) {
    return rows.map(function (row) {
        var cells = row.getAllCells();
        var cellsContent = cells.filter(function (x) { return x.column.getIsVisible(); }).map(function (x) { return x.getValue(); });
        return cellsContent;
    });
};
exports.default = exportToCsv;
