import type { ResourceSource, ResourceFetcher, ResourceOptions, ResourceReturn } from '../types';
export declare function useResource<T, R = unknown>(fetcher: ResourceFetcher<unknown, T, R>, options?: ResourceOptions<T, unknown>): ResourceReturn<T, R>;
export declare function useResource<T, S, R = unknown>(source: ResourceSource<S>, fetcher: ResourceFetcher<NoInfer<S>, T, R>, options?: ResourceOptions<T, S>): ResourceReturn<T, R>;
//# sourceMappingURL=use-resource.d.ts.map