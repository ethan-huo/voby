/* IMPORT */
import { resolve } from '../methods/resolve';
import { context } from '../oby';
import { isFunction, isNil } from '../utils/lang';
function createContext(init, name) {
    const symbol = Symbol();
    const hasDefault = arguments.length > 0 && !isFunction(init) && init !== undefined;
    const defaultValue = hasDefault ? init : undefined;
    const contextName = typeof name === 'string' ? name : undefined;
    const ProviderInternal = ({ value, children, }) => {
        return context({ [symbol]: value }, () => {
            return resolve(children);
        });
    };
    const Provider = (props) => {
        const { children, ...rest } = props || {};
        const value = isFunction(init)
            ? init(rest)
            : hasDefault
                ? init
                : props.value;
        return ProviderInternal({ value, children });
    };
    const use = () => {
        const valueContext = context(symbol);
        const value = isNil(valueContext) ? defaultValue : valueContext;
        if (isNil(value) && !hasDefault) {
            if (contextName) {
                throw new Error(`Missing ${contextName}Provider. Wrap your tree with <${contextName}Provider>.`);
            }
            throw new Error('Missing Context Provider. Wrap your tree with the matching <Provider>.');
        }
        return value;
    };
    return [Provider, use];
}
/* EXPORT */
export { createContext };
//# sourceMappingURL=create-context.js.map