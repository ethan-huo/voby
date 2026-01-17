/* IMPORT */
import { resolve } from '../methods/resolve';
import { context, tryCatch } from '../oby';
import { castError, isFunction, isNil } from '../utils/lang';
function createContext(init, name) {
    const symbol = Symbol();
    const contextName = typeof name === 'string' ? name : undefined;
    const ProviderInternal = ({ value, children, }) => {
        return context({ [symbol]: value }, () => {
            const label = contextName
                ? `${contextName}Provider error`
                : 'Context Provider error';
            const wrapped = tryCatch(children, ({ error }) => {
                return `${label}: ${error.message}`;
            });
            return resolve(wrapped);
        });
    };
    const Provider = (props) => {
        const { children, ...rest } = props || {};
        let value;
        try {
            value = isFunction(init)
                ? init(rest)
                : props.value;
            if (isNil(value)) {
                throw new Error('Context Provider value must be non-null. Wrap nulls inside your value object instead.');
            }
        }
        catch (error) {
            const contextLabel = contextName
                ? `${contextName}Provider init error`
                : 'Context Provider init error';
            const message = `${contextLabel}: ${castError(error).message}`;
            return resolve(message);
        }
        return ProviderInternal({ value, children });
    };
    const use = () => {
        const valueContext = context(symbol);
        const value = valueContext;
        if (isNil(value)) {
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