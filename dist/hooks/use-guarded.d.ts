import type { FunctionMaybe } from '../types';
export declare const useGuarded: <T, U extends T>(value: FunctionMaybe<T>, guard: (value: T) => value is U) => (() => U);
//# sourceMappingURL=use-guarded.d.ts.map