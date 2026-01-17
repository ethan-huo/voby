import type { Disposer, FN, FunctionMaybe, ObservableMaybe } from '../types';
export declare const useScheduler: <T, U>({ loop, once, callback, cancel, schedule, }: {
    loop?: FunctionMaybe<boolean>;
    once?: boolean;
    callback: ObservableMaybe<FN<[U]>>;
    cancel: FN<[T]>;
    schedule: (callback: FN<[U]>) => T;
}) => Disposer;
//# sourceMappingURL=use-scheduler.d.ts.map