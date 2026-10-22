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
var escapeCsvValue = function (value, delimiter, preventFormulaInjection) {
    var text = value == null ? "" : String(value);
    if (preventFormulaInjection &&
        typeof value === "string" &&
        /^[=+\-@\t\r]/.test(text)) {
        text = "'".concat(text);
    }
    return text.includes(delimiter) || /["\r\n]/.test(text)
        ? "\"".concat(text.replace(/"/g, '""'), "\"")
        : text;
};
var getCsvBlob = function (headers, rows, options) {
    if (options === void 0) { options = {}; }
    var _a = options.delimiter, delimiter = _a === void 0 ? "," : _a, formatCell = options.formatCell, _b = options.includeBom, includeBom = _b === void 0 ? false : _b, _c = options.preventFormulaInjection, preventFormulaInjection = _c === void 0 ? false : _c;
    var data = __spreadArray([(0, exports.getHeaderNames)(headers)], __read(getRowsData(rows, formatCell)), false);
    var csvContent = "".concat(includeBom ? "\uFEFF" : "").concat(data
        .map(function (row) {
        return row
            .map(function (value) {
            return escapeCsvValue(value, delimiter, preventFormulaInjection);
        })
            .join(delimiter);
    })
        .join("\r\n"), "\r\n");
    return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
};
exports.getCsvBlob = getCsvBlob;
var exportToCsv = function (fileName, headers, rows, options) {
    if (fileName === void 0) { fileName = "data"; }
    if (options === void 0) { options = {}; }
    var blob = (0, exports.getCsvBlob)(headers, rows, options);
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
var getRowsData = function (rows, formatCell) {
    return rows.map(function (row) {
        return row
            .getVisibleCells()
            .map(function (cell) {
            return formatCell ? formatCell(cell.getValue(), cell) : cell.getValue();
        });
    });
};
exports.default = exports.exportToCsv;
