/* IMPORT */
import { useEffect } from '../hooks/use-effect';
import { useSuspended } from '../hooks/use-suspended';
import { get } from '../methods/get';
import { untrack } from '../methods/untrack';
/* MAIN */
export const useScheduler = ({ loop, once, callback, cancel, schedule, }) => {
    let executed = false;
    let suspended = useSuspended();
    let tickId;
    const work = (value) => {
        executed = true;
        if (get(loop))
            tick();
        get(callback, false)(value);
    };
    const tick = () => {
        tickId = untrack(() => schedule(work));
    };
    const dispose = () => {
        untrack(() => cancel(tickId));
    };
    useEffect(() => {
        if (once && executed)
            return;
        if (suspended())
            return;
        tick();
        return dispose;
    }, { suspense: false });
    return dispose;
};
//# sourceMappingURL=use-scheduler.js.map