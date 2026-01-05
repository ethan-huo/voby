/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
import { get } from '../methods/get';
/* MAIN */
export const useInterval = (callback, ms) => {
    return useScheduler({
        callback,
        cancel: clearInterval,
        schedule: (callback) => setInterval(callback, get(ms)),
    });
};
//# sourceMappingURL=use-interval.js.map