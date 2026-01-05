import type { Child, FunctionMaybe, Indexed, ObservableReadonly } from '../types';
declare function For<T>({ values, fallback, pooled, unkeyed, children, }: {
    values?: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    pooled?: false;
    unkeyed?: false;
    children: (value: T, index: FunctionMaybe<number>) => Child;
}): ObservableReadonly<Child>;
declare function For<T>({ values, fallback, pooled, unkeyed, children, }: {
    values?: FunctionMaybe<readonly T[]>;
    fallback?: Child;
    pooled?: boolean;
    unkeyed: true;
    children: (value: Indexed<T>, index: FunctionMaybe<number>) => Child;
}): ObservableReadonly<Child>;
export { For };
//# sourceMappingURL=for.d.ts.map