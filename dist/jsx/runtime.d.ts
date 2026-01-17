import type { Component, Element } from '../types';
import { Fragment } from '../components/fragment';
export type { JSX } from './types';
declare const jsx: <P extends {} = {}>(component: Component<P>, props?: P | null, key?: unknown) => Element;
export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
//# sourceMappingURL=runtime.d.ts.map