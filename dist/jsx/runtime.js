/* IMPORT */
import { Fragment } from '../components/fragment';
import { createElement } from '../methods/create-element';
/* MAIN */
const jsx = (component, props, key) => {
    props = key !== undefined ? { ...props, key } : props; //TSC
    return createElement(component, props);
};
/* EXPORT */
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
//# sourceMappingURL=runtime.js.map