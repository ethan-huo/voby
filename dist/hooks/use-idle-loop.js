/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
import { get } from '../methods/get';
/* MAIN */
export const useIdleLoop = (callback, options) => {
    return useScheduler({
        callback,
        loop: true,
        cancel: cancelIdleCallback,
        schedule: (callback) => requestIdleCallback(callback, get(options)),
    });
};
//# sourceMappingURL=use-idle-loop.js.map