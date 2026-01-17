import type { Classes, ObservableMaybe, Styles } from '../types';
declare const resolveChild: <T>(value: ObservableMaybe<T>, setter: (value: T | T[], dynamic: boolean) => void, _dynamic?: boolean) => void;
declare const resolveClass: (classes: Classes, resolved?: Record<string, true>) => Record<string, true>;
declare const resolveStyle: (styles: Styles, resolved?: Record<string, null | undefined | number | string> | string) => Record<string, null | undefined | number | string> | string;
declare const resolveArraysAndStatics: (values: any[]) => [any[], boolean];
export { resolveChild, resolveClass, resolveStyle, resolveArraysAndStatics };
//# sourceMappingURL=resolvers.d.ts.map