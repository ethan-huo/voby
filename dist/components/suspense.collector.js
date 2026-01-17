/* IMPORT */
import { SYMBOL_SUSPENSE_COLLECTOR } from '../constants';
import { useMemo } from '../hooks/use-memo';
import { $ } from '../methods/S';
import { context, resolve } from '../oby';
export const SuspenseCollector = {
    create: () => {
        //TODO: Optimize this, some parts are unnecessarily slow, we just need a counter of active suspenses here really
        const parent = SuspenseCollector.get();
        const suspenses = $([]);
        const active = useMemo(() => suspenses().some((suspense) => suspense.active()));
        const register = (suspense) => {
            parent?.register(suspense);
            suspenses((prev) => [...prev, suspense]);
        };
        const unregister = (suspense) => {
            parent?.unregister(suspense);
            suspenses((prev) => prev.filter((other) => other !== suspense));
        };
        const data = { suspenses, active, register, unregister };
        return data;
    },
    get: () => {
        return context(SYMBOL_SUSPENSE_COLLECTOR);
    },
    wrap: (fn) => {
        const data = SuspenseCollector.create();
        return context({ [SYMBOL_SUSPENSE_COLLECTOR]: data }, () => {
            return resolve(() => fn(data));
        });
    },
};
//# sourceMappingURL=suspense.collector.js.map