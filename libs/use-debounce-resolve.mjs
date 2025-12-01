import DebounceResolve from "./debounce-resolve.mjs";


/**
 * @template K, V
 * @param {DebounceResolveFn<K,V>} fn
 * @param {?DebounceResolveOpts<K,V>} [opts]
 * @return {DebounceResolve<K,V>}
 */
export default function useDebounceResolve(fn, opts){
    return new DebounceResolve(fn, opts);
};










