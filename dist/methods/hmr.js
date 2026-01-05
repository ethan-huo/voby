/* IMPORT */
import { useMemo } from '../hooks/use-memo';
import { resolve } from '../methods/resolve';
import { $ } from '../methods/S';
import { untrack } from '../methods/untrack';
import { isFunction } from '../utils/lang';
/* HELPERS */
const COMPONENT_RE = /^_?[A-Z][a-zA-Z0-9$_-]*$/;
const SYMBOL_AS = '__hmr_as__';
const SYMBOL_COLD_COMPONENT = Symbol('HMR.Cold');
const SYMBOL_HOT_COMPONENT = Symbol('HMR.Hot');
const SYMBOL_HOT_ID = Symbol('HMR.ID');
const SOURCES = new WeakMap();
/* MAIN */
//TODO: This seems excessively complicated, maybe it can be simplified somewhat?
//TODO: Make this work better when a nested component is added/removed too
const hmr = (accept, component) => {
    const c = component;
    if (accept) {
        // Making the component hot
        /* CHECK */
        const cached = c[SYMBOL_HOT_COMPONENT];
        if (cached)
            return cached; // Already hot
        const isProvider = !isFunction(component) && 'Provider' in component;
        if (isProvider)
            return component; // Context providers are not hot-reloadable
        /* HELPERS */
        const createHotComponent = (path) => {
            return (...args) => {
                return useMemo(() => {
                    const component = path.reduce((component, key) => component[key], SOURCES.get(id())?.() || source());
                    const result = resolve(untrack(() => component(...args)));
                    return result;
                });
            };
        };
        const createHotComponentDeep = (component, path) => {
            const c = component;
            const cached = c[SYMBOL_HOT_COMPONENT];
            if (cached)
                return cached;
            const hot = (c[SYMBOL_HOT_COMPONENT] = createHotComponent(path));
            for (const key in component) {
                const value = component[key];
                if (isFunction(value) && COMPONENT_RE.test(key)) {
                    // A component
                    hot[key] = createHotComponentDeep(value, [...path, key]);
                }
                else {
                    // Something else
                    hot[key] = value;
                }
            }
            return hot;
        };
        const onAccept = (module) => {
            const hot = module[c[SYMBOL_AS]] || module[component.name] || module.default;
            if (!hot)
                return console.error(`[hmr] Failed to handle update for "${component.name}" component:\n\n`, component);
            const cold = hot[SYMBOL_COLD_COMPONENT] || hot;
            hot[SYMBOL_HOT_ID]?.(id());
            SOURCES.get(id())?.(() => cold);
        };
        /* MAIN */
        const id = $({});
        const source = $(component);
        SOURCES.set(id(), source);
        const cold = c[SYMBOL_COLD_COMPONENT] || component;
        const hot = createHotComponentDeep(component, []);
        cold[SYMBOL_HOT_COMPONENT] = hot;
        hot[SYMBOL_COLD_COMPONENT] = cold;
        hot[SYMBOL_HOT_COMPONENT] = hot;
        hot[SYMBOL_HOT_ID] = id;
        accept(onAccept);
        /* RETURN */
        return hot;
    }
    else {
        // Returning the component as is
        return component;
    }
};
/* EXPORT */
export { hmr };
//# sourceMappingURL=hmr.js.map