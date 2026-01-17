import type { Callback, Child, FN, ObservableReadonly } from '../types';
export declare const ErrorBoundary: ({ fallback, children, }: {
    fallback: Child | FN<[{
        error: Error;
        reset: Callback;
    }], Child>;
    children: Child;
}) => ObservableReadonly<Child>;
//# sourceMappingURL=error-boundary.d.ts.map