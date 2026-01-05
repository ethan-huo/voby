/* IMPORT */
import { useGuarded } from '../hooks/use-guarded';
import { useUntracked } from '../hooks/use-untracked';
import { isObservable } from '../methods/is-observable';
import { ternary } from '../oby';
import { isComponent, isFunction, isTruthy } from '../utils/lang';
/* MAIN */
//TODO: Support an is/guard prop, maybe
export const If = ({ when, fallback, children, }) => {
    if (isFunction(children) &&
        !isObservable(children) &&
        !isComponent(children)) {
        // Calling the children function with an (() => Truthy<T>)
        const truthy = useGuarded(when, isTruthy);
        return ternary(when, useUntracked(() => children(truthy)), fallback);
    }
    else {
        // Just passing the children along
        return ternary(when, children, fallback); //TSC
    }
};
//# sourceMappingURL=if.js.map