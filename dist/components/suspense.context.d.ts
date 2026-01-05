import type { SuspenseData } from '../types';
import { resolve } from '../oby';
type SuspenseContextAPI = {
    create: () => SuspenseData;
    get: () => SuspenseData | undefined;
    wrap: <T>(fn: (data: SuspenseData) => T) => ReturnType<typeof resolve>;
};
export declare const SuspenseContext: SuspenseContextAPI;
export {};
//# sourceMappingURL=suspense.context.d.ts.map