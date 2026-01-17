/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
import { get } from '../methods/get';
/* MAIN */
export const useTimeout = (callback, ms) => {
    return useScheduler({
        callback,
        once: true,
        cancel: clearTimeout,
        schedule: (callback) => setTimeout(callback, get(ms)),
    });
};
//# sourceMappingURL=use-timeout.js.map