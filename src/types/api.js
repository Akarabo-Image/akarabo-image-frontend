/** Shared transport-level shapes returned by the Akarabo Image API. */
/** Normalised error surfaced to the UI layer. */
export class ApiError extends Error {
    constructor(message, statusCode, errors = [], error = 'Unknown Error') {
        super(message);
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "error", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
        this.error = error;
    }
    /** True when the request was rejected because of missing/expired auth. */
    get isUnauthorized() {
        return this.statusCode === 401;
    }
    /** True when the caller is authenticated but lacks the required role. */
    get isForbidden() {
        return this.statusCode === 403;
    }
}
