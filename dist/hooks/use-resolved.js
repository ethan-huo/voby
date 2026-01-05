/* IMPORT */
import { isObservable } from '../methods/is-observable';
import { isArray, isFunction } from '../utils/lang';
function useResolved(values, callback, resolveFunction) {
    const isResolvable = resolveFunction !== false && callback !== false ? isFunction : isObservable;
    const resolve = (value) => (isResolvable(value) ? value() : value);
    if (isArray(values)) {
        const resolved = values.map(resolve);
        if (isFunction(callback)) {
            return callback.apply(undefined, resolved);
        }
        else {
            return resolved;
        }
    }
    else {
        const resolved = resolve(values);
        if (isFunction(callback)) {
            return callback(resolved);
        }
        else {
            return resolved;
        }
    }
}
/* EXPORT */
export { useResolved };
//# sourceMappingURL=use-resolved.js.map