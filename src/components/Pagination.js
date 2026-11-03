import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeftIcon, ChevronRightIcon } from '../assets';
import { Button } from './Button';
import { PAGE_SIZE_OPTIONS } from '../data/constants';
/** Page controls shown under every list table. */
export function Pagination({ page, limit, total, canGoPrevious, canGoNext, onPageChange, onLimitChange, }) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const firstRow = total === 0 ? 0 : (page - 1) * limit + 1;
    const lastRow = Math.min(page * limit, total);
    return (_jsxs("div", { className: "ak-pagination", children: [_jsx("span", { children: total === 0
                    ? 'No records'
                    : `Showing ${firstRow}–${lastRow} of ${total}` }), _jsxs("div", { className: "ak-pagination__controls", children: [_jsxs("label", { className: "ak-row ak-gap-2 ak-small", children: [_jsx("span", { className: "ak-muted", children: "Rows" }), _jsx("select", { className: "ak-select", style: { height: 32, width: 74 }, value: limit, onChange: (event) => onLimitChange(Number(event.target.value)), "aria-label": "Rows per page", children: PAGE_SIZE_OPTIONS.map((size) => (_jsx("option", { value: size, children: size }, size))) })] }), _jsx(Button, { variant: "secondary", size: "sm", disabled: !canGoPrevious, onClick: () => onPageChange(page - 1), "aria-label": "Previous page", children: _jsx(ChevronLeftIcon, { size: 16 }) }), _jsxs("span", { className: "ak-pagination__page", children: [page, " / ", totalPages] }), _jsx(Button, { variant: "secondary", size: "sm", disabled: !canGoNext, onClick: () => onPageChange(page + 1), "aria-label": "Next page", children: _jsx(ChevronRightIcon, { size: 16 }) })] })] }));
}
export default Pagination;
