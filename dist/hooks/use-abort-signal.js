/* IMPORT */
import { useAbortController } from '../hooks/use-abort-controller';
/* MAIN */
export const useAbortSignal = (signals = []) => {
    return useAbortController(signals).signal;
};
//# sourceMappingURL=use-abort-signal.js.map