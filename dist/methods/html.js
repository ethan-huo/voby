/* IMPORT */
import htm from 'htm';
import { createElement } from '../methods/create-element';
import { assign } from '../utils/lang';
/* HELPERS */
const registry = {};
const h = (type, props, ...children) => createElement(registry[type] || type, props, ...children);
const register = (components) => void assign(registry, components);
/* MAIN */
const html = assign(htm.bind(h), { register });
/* EXPORT */
export { html };
//# sourceMappingURL=html.js.map