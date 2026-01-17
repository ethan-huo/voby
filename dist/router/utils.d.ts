import type { Observable, ObservableReadonly } from '../types';
import type { Params, PathMatch, Route, SetParams } from './types';
export declare function resolvePath(base: string, path: string, from?: string): string | undefined;
export declare function invariant<T>(value: T | null | undefined, message: string): T;
export declare function joinPaths(from: string, to: string): string;
export declare function extractSearchParams(url: URL): Params;
export declare function urlDecode(str: string, isQuery?: boolean): string;
export declare function createMatcher(path: string, partial?: boolean): (location: string) => PathMatch | null;
export declare function scoreRoute(route: Route): number;
export declare function createMemoObject<T extends Record<string | symbol, unknown>>(fn: () => T): T;
export declare function mergeSearchString(search: string, params: SetParams): string;
export declare function on<T>(deps: () => void, fn: () => T): ObservableReadonly<T>;
export declare function useSignal<T>(observable: Observable<T>): [() => T, (value: T) => void];
export declare function expandOptionals(pattern: string): string[];
//# sourceMappingURL=utils.d.ts.map