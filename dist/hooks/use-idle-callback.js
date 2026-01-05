/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
import { get } from '../methods/get';
/* MAIN */
export const useIdleCallback = (callback, options) => {
    return useScheduler({
        callback,
        once: true,
        cancel: cancelIdleCallback,
        schedule: (callback) => requestIdleCallback(callback, get(options)),
    });
};
//# sourceMappingURL=use-idle-callback.js.map