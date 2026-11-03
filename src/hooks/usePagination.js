/**
 * Shared pagination helpers for every list screen.
 *
 * A screen keeps the `page` / `limit` state with `usePaginationState` (it
 * needs both to build the API query) and derives the controls with
 * `usePaginationControls` once the API `meta` block is known.
 */
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../data/constants';
/** Owns the page / limit state of a list screen. */
export function usePaginationState(initialLimit = DEFAULT_PAGE_SIZE) {
    const [page, setPageState] = useState(1);
    const [limit, setLimitState] = useState(initialLimit);
    const setPage = useCallback((next) => {
        setPageState(Math.max(1, Math.round(next)));
    }, []);
    const setLimit = useCallback((next) => {
        setLimitState(next);
        setPageState(1);
    }, []);
    const reset = useCallback(() => setPageState(1), []);
    return useMemo(() => ({ page, limit, setPage, setLimit, reset }), [page, limit, setPage, setLimit, reset]);
}
/** Derives the enabled/disabled state of the page controls. */
export function usePaginationControls({ page, limit, total, }) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return useMemo(() => ({
        total,
        totalPages,
        canGoPrevious: page > 1,
        canGoNext: page < totalPages,
    }), [page, total, totalPages]);
}
