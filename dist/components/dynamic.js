/* IMPORT */
import { useMemo } from '../hooks/use-memo';
import { createElement } from '../methods/create-element';
import { get } from '../methods/get';
import { resolve } from '../methods/resolve';
import { isFunction } from '../utils/lang';
/* MAIN */
export const Dynamic = ({ component, props, children, }) => {
    if (isFunction(component) || isFunction(props)) {
        return useMemo(() => {
            return resolve(createElement(get(component, false), get(props), children));
        });
    }
    else {
        return createElement(component, props, children);
    }
};
//# sourceMappingURL=dynamic.js.map