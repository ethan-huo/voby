/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
/* MAIN */
export const useAnimationFrame = (callback) => {
    return useScheduler({
        callback,
        once: true,
        cancel: cancelAnimationFrame,
        schedule: requestAnimationFrame,
    });
};
//# sourceMappingURL=use-animation-frame.js.map