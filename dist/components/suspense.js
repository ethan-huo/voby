/* IMPORT */
import { SuspenseContext } from '../components/suspense.context';
import { useMemo } from '../hooks/use-memo';
import { useSuspense } from '../hooks/use-suspense';
import { get } from '../methods/get';
import { resolve } from '../methods/resolve';
import { ternary } from '../oby';
/* MAIN */
export const Suspense = ({ when, fallback, children, }) => {
    return SuspenseContext.wrap((suspense) => {
        const condition = useMemo(() => !!get(when) || suspense.active());
        const childrenSuspended = useSuspense(condition, () => resolve(children));
        return ternary(condition, fallback, childrenSuspended);
    });
};
//# sourceMappingURL=suspense.js.map