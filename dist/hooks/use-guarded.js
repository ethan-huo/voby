/* IMPORT */
import { useMemo } from '../hooks/use-memo';
import { get } from '../methods/get';
import { isNil } from '../utils/lang';
/* MAIN */
//TODO: Maybe port this to oby, as "when" or "is" or "guarded"
//TODO: Optimize this, checking if the value is actually potentially reactive
export const useGuarded = (value, guard) => {
    let valueLast;
    const guarded = useMemo(() => {
        const current = get(value);
        if (!guard(current))
            return valueLast;
        return (valueLast = current);
    });
    return () => {
        const current = guarded();
        if (isNil(current))
            throw new Error('The value never passed the type guard');
        return current;
    };
};
//# sourceMappingURL=use-guarded.js.map