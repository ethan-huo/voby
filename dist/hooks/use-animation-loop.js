/* IMPORT */
import { useScheduler } from '../hooks/use-scheduler';
/* MAIN */
export const useAnimationLoop = (callback) => {
    return useScheduler({
        callback,
        loop: true,
        cancel: cancelAnimationFrame,
        schedule: requestAnimationFrame,
    });
};
//# sourceMappingURL=use-animation-loop.js.map