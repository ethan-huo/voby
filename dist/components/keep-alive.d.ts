import type { Child, FunctionMaybe, ObservableReadonly } from '../types';
declare const KeepAlive: ({ id, ttl, children, }: {
    id: FunctionMaybe<string>;
    ttl?: FunctionMaybe<number>;
    children: Child;
}) => ObservableReadonly<Child>;
export { KeepAlive };
//# sourceMappingURL=keep-alive.d.ts.map