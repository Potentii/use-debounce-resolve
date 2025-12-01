import {ref} from "vue";
import {useDebounceFn} from "@vueuse/core";


/**
 * @template K, V
 * @typedef {{
 *     delay: ?number,
 *     maxWait: ?number,
 * }} DebounceResolveOpts
 */


/**
 * @template K, V
 * @typedef {(keys: K[], resolveItem: (key: K, value: V) => void, rejectItem: (key: K, error: Error) => void) => (Promise<void>|void)} DebounceResolveFn
 */



/**
 * @template K, V
 */
export default class DebounceResolve {

    /**
     *
     * @type {import('vue').Ref<Map<K, { resolve: (value: V) => void, reject: (error: Error) => void }>>}
     */
    #keysWithCallback = ref(new Map());


    /**
     *
     * @type {?DebounceResolveOpts<K,V>}
     */
    #opts;

    /**
     *
     * @type {import("@vueuse/core").UseDebounceFnReturn<(function(): Promise<void>)|*>}
     */
    #debounce;



    /**
     *
     * @param {DebounceResolveFn<K,V>} fn
     * @param {?DebounceResolveOpts<K,V>} [opts]
     */
    constructor(fn, opts) {
        this.#opts = opts;

        this.#debounce = useDebounceFn(async () => {
            const keysToResolve = [...this.#keysWithCallback.value.keys()];

            const resolveItem = (key, value) => {
                if(!this.#keysWithCallback.value.has(key))
                    return;
                this.#keysWithCallback.value.delete(key);
                try{
                    this.#keysWithCallback.value.get(key)?.resolve(value);
                } catch (err){
                    console.error(err);
                }
            };

            const rejectItem = (key, error) => {
                if(!this.#keysWithCallback.value.has(key))
                    return;
                this.#keysWithCallback.value.delete(key);
                try{
                    this.#keysWithCallback.value.get(key)?.reject(error);
                } catch (err){
                    console.error(err);
                }
            };

            try {
                await fn(keysToResolve, resolveItem, rejectItem);
            } catch (err){
                console.error(err);
                for (let key of keysToResolve) {
                    rejectItem(key, err);
                }
            } finally {
                for (let key of keysToResolve)
                    this.#keysWithCallback.value.delete(key);
            }
        }, opts.delay ?? 0, { maxWait: opts.maxWait ?? Infinity });
    }

    /**
     *
     * @param {K} key
     * @return {Promise<V>}
     */
    async handle(key){
        return new Promise((resolve, reject) => {
            this.#keysWithCallback.value.set(key, { resolve, reject });
            this.#debounce();
        });
    }

}