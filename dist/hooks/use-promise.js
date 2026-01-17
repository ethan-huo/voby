/* IMPORT */
import { useResource } from '../hooks/use-resource';
import { get } from '../methods/get';
/* MAIN */
export const usePromise = (promise) => {
    return useResource(() => get(promise));
};
//# sourceMappingURL=use-promise.js.map