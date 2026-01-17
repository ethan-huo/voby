/* IMPORT */
import { useEffect } from '../hooks/use-effect';
import { useResolved } from '../hooks/use-resolved';
import { get } from '../methods/get';
import { castArray } from '../utils/lang';
function useEventListener(target, event, handler, options) {
    return useEffect(() => {
        const fn = get(handler, false);
        return useResolved([target, event, options], (target, event, options) => {
            const targets = castArray(target);
            targets.forEach((target) => {
                target?.addEventListener(event, fn, options);
            });
            return () => {
                targets.forEach((target) => {
                    target?.removeEventListener(event, fn, options);
                });
            };
        });
    }, { sync: 'init' });
}
/* EXPORT */
export { useEventListener };
//# sourceMappingURL=use-event-listener.js.map