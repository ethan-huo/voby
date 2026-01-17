import type { Child, Component, Element } from '../types';
declare function h<P = {}>(component: Component<P>, child: Child): Element;
declare function h<P = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element;
export { h };
//# sourceMappingURL=h.d.ts.map