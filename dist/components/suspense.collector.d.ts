import type { SuspenseCollectorData } from '../types';
import { resolve } from '../oby';
type SuspenseCollectorAPI = {
    create: () => SuspenseCollectorData;
    get: () => SuspenseCollectorData | undefined;
    wrap: <T>(fn: (data: SuspenseCollectorData) => T) => ReturnType<typeof resolve>;
};
export declare const SuspenseCollector: SuspenseCollectorAPI;
export {};
//# sourceMappingURL=suspense.collector.d.ts.map