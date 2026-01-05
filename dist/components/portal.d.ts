import type { Child, ChildWithMetadata, FunctionMaybe } from '../types';
export declare const Portal: ({ when, mount, wrapper, children, }: {
    mount?: Child;
    when?: FunctionMaybe<boolean>;
    wrapper?: Child;
    children: Child;
}) => ChildWithMetadata<{
    portal: HTMLElement;
}>;
//# sourceMappingURL=portal.d.ts.map