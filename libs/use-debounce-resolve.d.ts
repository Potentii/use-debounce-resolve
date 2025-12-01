import DebounceResolve, { DebounceResolveFn, DebounceResolveOpts } from './debounce-resolve'

export default function useDebounceResolve<K, V>(
    fn: DebounceResolveFn<K, V>,
    opts?: DebounceResolveOpts<K, V> | null
): DebounceResolve<K, V>
