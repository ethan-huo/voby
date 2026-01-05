import type { ObservableMaybe, PromiseMaybe, Resource } from '../types';
export declare const useResource: <T>(fetcher: () => ObservableMaybe<PromiseMaybe<T>>) => Resource<T>;
//# sourceMappingURL=use-resource.d.ts.map