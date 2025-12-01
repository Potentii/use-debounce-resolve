export type DebounceResolveOpts<K, V> = {
    delay?: number | null;
    maxWait?: number | null;
};

export type DebounceResolveFn<K, V> = (
    keys: K[],
    resolveItem: (key: K, value: V) => void,
    rejectItem: (key: K, error: Error) => void
) => Promise<void> | void;

export default class DebounceResolve<K, V> {
    constructor(fn: DebounceResolveFn<K, V>, opts?: DebounceResolveOpts<K, V> | null)

    /** Schedule resolving a single key and return its Promise. */
    handle(key: K): Promise<V>
}
