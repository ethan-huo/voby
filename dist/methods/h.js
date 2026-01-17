/* IMPORT */
import { createElement } from '../methods/create-element';
import { isArray, isObject } from '../utils/lang';
function h(component, props, ...children) {
    if (children.length || (isObject(props) && !isArray(props))) {
        return createElement(component, props, ...children); //TSC
    }
    else {
        return createElement(component, null, props); //TSC
    }
}
/* EXPORT */
export { h };
//# sourceMappingURL=h.js.map