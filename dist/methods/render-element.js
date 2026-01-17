/* IMPORT */
import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants';
import { createElement } from '../methods/create-element';
import { mergePropsN, mergeRefs } from '../methods/merge-props';
import { untrack } from '../methods/untrack';
import { wrapElement } from '../methods/wrap-element';
import { isArray, isFunction, isNil, isNode, isString } from '../utils/lang';
import { setProps } from '../utils/setters';
export const renderElement = (component, componentProps = {}, params = {}) => {
    const { render, ...externalProps } = componentProps;
    const { enabled = true, props, ref, state = {} } = params;
    if (enabled === false)
        return null;
    const propList = [];
    if (!isNil(props)) {
        if (isArray(props)) {
            propList.push(...props);
        }
        else {
            propList.push(props);
        }
    }
    propList.push(externalProps);
    const mergedProps = mergePropsN(propList);
    const outProps = isNil(ref)
        ? mergedProps
        : { ...mergedProps, ref: mergeRefs(mergedProps.ref, ref) };
    if (!isNil(render)) {
        if (isFunction(render)) {
            if (SYMBOL_UNTRACKED_UNWRAPPED in render) {
                throw new Error('Invalid render prop: pass a render function, not a Voby element');
            }
            return wrapElement(() => untrack(() => render(outProps, state)));
        }
        else if (isString(render)) {
            return createElement(render, outProps);
        }
        else if (isNode(render)) {
            if (render instanceof HTMLElement) {
                setProps(render, outProps);
            }
            return render;
        }
    }
    return createElement(component, outProps);
};
//# sourceMappingURL=render-element.js.map