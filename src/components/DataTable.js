import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Thin wrapper around a semantic table with consistent styling. */
export function DataTable({ columns, rows, rowKey, empty, className, }) {
    if (rows.length === 0 && empty) {
        return _jsx(_Fragment, { children: empty });
    }
    return (_jsx("div", { className: `ak-table-wrap w-full overflow-x-auto${className ? ` ${className}` : ''}`, children: _jsxs("table", { className: "ak-table min-w-full", children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { style: column.width ? { width: column.width } : undefined, className: column.align === 'right'
                                ? 'ak-table__align-right'
                                : column.align === 'center'
                                    ? 'ak-table__align-center'
                                    : undefined, children: column.header }, column.key))) }) }), _jsx("tbody", { children: rows.map((row) => (_jsx("tr", { children: columns.map((column) => (_jsx("td", { "data-label": column.header, className: column.align === 'right'
                                ? 'ak-table__align-right'
                                : column.align === 'center'
                                    ? 'ak-table__align-center'
                                    : undefined, children: column.render(row) }, column.key))) }, rowKey(row)))) })] }) }));
}
export default DataTable;
