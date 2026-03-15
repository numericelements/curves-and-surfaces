export function isIterable<T>(value: unknown): value is Iterable<T> {
    return value !== null
        && value !== undefined
        && typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === "function";
}