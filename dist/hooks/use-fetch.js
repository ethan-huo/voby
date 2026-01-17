/* IMPORT */
import { useAbortSignal } from '../hooks/use-abort-signal';
import { useResolved } from '../hooks/use-resolved';
import { useResource } from '../hooks/use-resource';
/* MAIN */
export const useFetch = (request, init) => {
    return useResource(() => {
        return useResolved([request, init], (request, init = {}) => {
            const signal = useAbortSignal(init.signal || []);
            init.signal = signal;
            return fetch(request, init);
        });
    });
};
//# sourceMappingURL=use-fetch.js.map