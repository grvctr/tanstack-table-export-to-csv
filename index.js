"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeaderNames = exports.exportToCsv = exports.getCsvBlob = void 0;
var react_innertext_1 = require("react-innertext");
var escapeCsvValue = function (value) {
    var text = value == null ? "" : String(value);
    return /[",\r\n]/.test(text) ? "\"".concat(text.replace(/"/g, '""'), "\"") : text;
};
var getCsvBlob = function (headers, rows) {
    var data = __spreadArray([(0, exports.getHeaderNames)(headers)], __read(getRowsData(rows)), false);
    var csvContent = "".concat(data
        .map(function (row) { return row.map(escapeCsvValue).join(","); })
        .join("\r\n"), "\r\n");
    return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
};
exports.getCsvBlob = getCsvBlob;
var exportToCsv = function (fileName, headers, rows) {
    if (fileName === void 0) { fileName = "data"; }
    var blob = (0, exports.getCsvBlob)(headers, rows);
    var link = document.createElement("a");
    var url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", /\.csv$/i.test(fileName) ? fileName : "".concat(fileName, ".csv"));
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
exports.exportToCsv = exportToCsv;
var getHeaderNames = function (headers) {
    return headers
        .filter(function (header) {
        return !header.isPlaceholder &&
            header.subHeaders.length === 0 &&
            header.column.getIsVisible();
    })
        .map(function (header) {
        var _a;
        if (typeof header.column.columnDef.header === "function") {
            var headerContext = header.column.columnDef.header(header.getContext());
            if (typeof headerContext === "string") {
                return headerContext;
            }
            return (0, react_innertext_1.default)(headerContext);
        }
        return (_a = header.column.columnDef.header) !== null && _a !== void 0 ? _a : header.id;
    });
};
exports.getHeaderNames = getHeaderNames;
var getRowsData = function (rows) {
    return rows.map(function (row) { return row.getVisibleCells().map(function (cell) { return cell.getValue(); }); });
};
exports.default = exports.exportToCsv;
