/* IMPORT */
import { castArray, flatten, isFunction, isFunctionReactive, isString, } from '../utils/lang';
const EMPTY_PROPS = {};
function mergeProps(a, b, c, d, e) {
    let merged = { ...resolvePropsGetter(a, EMPTY_PROPS) };
    if (b)
        merged = mergeOne(merged, b);
    if (c)
        merged = mergeOne(merged, c);
    if (d)
        merged = mergeOne(merged, d);
    if (e)
        merged = mergeOne(merged, e);
    return merged;
}
function mergePropsN(props) {
    if (props.length === 0)
        return EMPTY_PROPS;
    if (props.length === 1)
        return resolvePropsGetter(props[0], EMPTY_PROPS);
    let merged = { ...resolvePropsGetter(props[0], EMPTY_PROPS) };
    for (let i = 1, l = props.length; i < l; i++) {
        merged = mergeOne(merged, props[i]);
    }
    return merged;
}
const mergeOne = (merged, inputProps) => {
    if (isPropsGetter(inputProps))
        return inputProps(merged);
    return mutablyMergeInto(merged, inputProps);
};
const mutablyMergeInto = (mergedProps, externalProps) => {
    if (!externalProps)
        return mergedProps;
    for (const propName in externalProps) {
        const externalPropValue = externalProps[propName];
        const key = propName === 'className' ? 'class' : propName;
        switch (key) {
            case 'style': {
                mergedProps.style = mergeStyles(mergedProps.style, externalPropValue);
                break;
            }
            case 'class': {
                mergedProps.class = mergeClasses(mergedProps.class, externalPropValue);
                break;
            }
            case 'ref': {
                mergedProps.ref = mergeRefs(mergedProps.ref, externalPropValue);
                break;
            }
            default: {
                if (isEventHandler(key, externalPropValue)) {
                    mergedProps[key] = mergeEventHandlers(mergedProps[key], externalPropValue);
                }
                else if (key !== 'className') {
                    mergedProps[key] = externalPropValue;
                }
            }
        }
    }
    return mergedProps;
};
const isEventHandler = (key, value) => {
    const code0 = key.charCodeAt(0);
    const code1 = key.charCodeAt(1);
    return (code0 === 111 &&
        code1 === 110 &&
        (typeof value === 'function' || typeof value === 'undefined'));
};
const isPropsGetter = (inputProps) => {
    return isFunction(inputProps) && !isFunctionReactive(inputProps);
};
const resolvePropsGetter = (inputProps, previousProps) => {
    return isPropsGetter(inputProps)
        ? inputProps(previousProps)
        : (inputProps ?? previousProps);
};
const mergeEventHandlers = (ourHandler, theirHandler) => {
    if (!theirHandler)
        return ourHandler;
    if (!ourHandler)
        return theirHandler;
    return (event) => {
        makeEventPreventable(event);
        const result = theirHandler(event);
        const vobyEvent = getVobyEvent(event);
        if (!vobyEvent?.vobyHandlerPrevented) {
            ourHandler?.(event);
        }
        return result;
    };
};
const makeEventPreventable = (event) => {
    const vobyEvent = getVobyEvent(event);
    if (!vobyEvent)
        return;
    if (typeof vobyEvent.preventVobyHandler === 'function')
        return;
    vobyEvent.preventVobyHandler = () => {
        vobyEvent.vobyHandlerPrevented = true;
    };
};
const getVobyEvent = (event) => {
    if (!event || typeof event !== 'object')
        return null;
    return event;
};
const mergeClasses = (ourClass, theirClass) => {
    if (theirClass == null)
        return ourClass;
    if (ourClass == null)
        return theirClass;
    return [theirClass, ourClass];
};
const mergeStyles = (ourStyle, theirStyle) => {
    if (theirStyle == null)
        return ourStyle;
    if (ourStyle == null)
        return theirStyle;
    if (isString(ourStyle) || isString(theirStyle))
        return theirStyle;
    return [ourStyle, theirStyle];
};
const mergeRefs = (ourRef, theirRef) => {
    const normalizedOur = normalizeRefs(ourRef);
    const normalizedTheir = normalizeRefs(theirRef);
    if (normalizedOur == null)
        return normalizedTheir ?? null;
    if (normalizedTheir == null)
        return normalizedOur ?? null;
    return flatten(castArray(normalizedOur).concat(castArray(normalizedTheir))).filter(isRef);
};
const normalizeRefs = (value) => {
    if (value == null)
        return null;
    if (Array.isArray(value)) {
        const refs = flatten(castArray(value)).filter(isRef);
        return refs.length ? refs : null;
    }
    return value;
};
const isRef = (value) => {
    return isFunction(value);
};
/* EXPORT */
export { mergeProps, mergePropsN, mergeRefs };
//# sourceMappingURL=merge-props.js.map