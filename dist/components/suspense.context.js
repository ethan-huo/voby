/* IMPORT */
import { SYMBOL_SUSPENSE, SYMBOL_SUSPENSE_COLLECTOR } from '../constants';
import { useCleanup } from '../hooks/use-cleanup';
import { useMemo } from '../hooks/use-memo';
import { $ } from '../methods/S';
import { context, resolve } from '../oby';
export const SuspenseContext = {
    create: () => {
        const count = $(0);
        const active = useMemo(() => !!count());
        const increment = (nr = 1) => count((prev) => prev + nr);
        const decrement = (nr = -1) => queueMicrotask(() => count((prev) => prev + nr));
        const data = { active, increment, decrement };
        const collector = context(SYMBOL_SUSPENSE_COLLECTOR);
        if (collector) {
            collector?.register(data);
            useCleanup(() => collector.unregister(data));
        }
        return data;
    },
    get: () => {
        return context(SYMBOL_SUSPENSE);
    },
    wrap: (fn) => {
        const data = SuspenseContext.create();
        return context({ [SYMBOL_SUSPENSE]: data }, () => {
            return resolve(() => fn(data));
        });
    },
};
//# sourceMappingURL=suspense.context.js.map