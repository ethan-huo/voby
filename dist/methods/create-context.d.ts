import type { Child } from '../types';
declare function createContext<T extends {}>(init?: undefined, name?: string): [(props: {
    value: T;
    children: Child;
}) => Child, () => T];
declare function createContext<T extends {}, P>(init: (props: P) => T, name?: string): [(props: P & {
    children: Child;
}) => Child, () => T];
export { createContext };
//# sourceMappingURL=create-context.d.ts.map