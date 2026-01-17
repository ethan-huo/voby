import type { Child } from '../types';
export type Params = Record<string, string>;
export type SetParams = Record<string, string | number | boolean | null | undefined>;
export type Path = {
    pathname: string;
    search: string;
    hash: string;
};
export type Location<S = unknown> = Path & {
    query: Params;
    state: Readonly<Partial<S>> | null;
    key: string;
};
export type NavigateOptions<S = unknown> = {
    resolve: boolean;
    replace: boolean;
    scroll: boolean;
    state: S;
};
export type Navigator = {
    (to: string, options?: Partial<NavigateOptions>): void;
    (delta: number): void;
};
export type NavigatorFactory = (route?: RouteContext) => Navigator;
export type LocationChange<S = unknown> = {
    value: string;
    replace?: boolean;
    scroll?: boolean;
    state?: S;
};
export type LocationChangeSignal = [
    () => LocationChange,
    (next: LocationChange) => void
];
export type RouterIntegration = {
    signal: LocationChangeSignal;
    utils?: Partial<RouterUtils>;
};
export type RouteDataFuncArgs<T = unknown> = {
    data: T extends RouteDataFunc ? ReturnType<T> : T;
    params: Params;
    location: Location;
    navigate: Navigator;
};
export type RouteDataFunc<T = unknown, R = unknown> = (args: RouteDataFuncArgs<T>) => R;
export type RouteDefinition = {
    path: string | string[];
    data?: RouteDataFunc;
    children?: RouteDefinition | RouteDefinition[];
} & ({
    element?: never;
    component: () => Child;
} | {
    component?: never;
    element?: Child;
    preload?: () => void;
});
export type PathMatch = {
    params: Params;
    path: string;
};
export type RouteMatch = PathMatch & {
    route: Route;
};
export type OutputMatch = {
    originalPath: string;
    pattern: string;
    path: string;
    params: Params;
};
export type Route = {
    key: unknown;
    originalPath: string;
    pattern: string;
    element: () => Child;
    preload?: () => void;
    data?: RouteDataFunc;
    matcher: (location: string) => PathMatch | null;
};
export type Branch = {
    routes: Route[];
    score: number;
    matcher: (location: string) => RouteMatch[] | null;
};
export type RouteContext = {
    parent?: RouteContext;
    child?: RouteContext;
    data?: unknown;
    pattern: string;
    params: Params;
    path: () => string;
    outlet: () => Child;
    resolvePath(to: string): string | undefined;
};
export type RouterUtils = {
    renderPath(path: string): string;
    parsePath(str: string): string;
    go(delta: number): void;
};
export type RouterOutput = {
    url?: string;
    matches: OutputMatch[][];
};
export type RouterContext = {
    base: RouteContext;
    out?: RouterOutput;
    location: Location;
    navigatorFactory: NavigatorFactory;
    renderPath(path: string): string;
    parsePath(str: string): string;
};
//# sourceMappingURL=types.d.ts.map