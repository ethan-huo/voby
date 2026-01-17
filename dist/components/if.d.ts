import type { Child, FunctionMaybe, ObservableReadonly, Truthy } from '../types';
export declare const If: <T>({ when, fallback, children, }: {
    when: FunctionMaybe<T>;
    fallback?: Child;
    children: Child | ((value: () => Truthy<T>) => Child);
}) => ObservableReadonly<Child>;
//# sourceMappingURL=if.d.ts.map