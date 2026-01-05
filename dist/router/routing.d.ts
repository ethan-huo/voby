import type { ObservableReadonly, FunctionMaybe, Child } from '../types';
import type { Branch, Location, LocationChangeSignal, NavigateOptions, Navigator, Params, PathMatch, Route, RouteContext, RouteDataFunc, RouteDefinition, RouteMatch, RouterContext, RouterIntegration, SetParams } from './types';
declare const RouterContextProvider: (props: {
    value: RouterContext;
    children: Child;
}) => Child;
declare const RouteContextProvider: (props: {
    value: RouteContext;
    children: Child;
}) => Child;
export { RouterContextProvider, RouteContextProvider };
export declare const useRouter: () => RouterContext;
export declare const useRoute: () => RouteContext;
export declare const useResolvedPath: (path: () => string) => ObservableReadonly<string | undefined>;
export declare const useHref: (to: () => string | undefined) => ObservableReadonly<string | undefined>;
export declare const useNavigate: () => Navigator;
export declare const useLocation: <S = unknown>() => Location<S>;
export declare const useMatch: (path: () => string) => ObservableReadonly<PathMatch | null>;
export declare const useParams: <T extends Params>() => T;
type MaybeReturnType<T> = T extends (...args: unknown[]) => infer R ? R : T;
export declare const useRouteData: <T>() => MaybeReturnType<T>;
export declare const useSearchParams: <T extends Params>() => [T, (params: SetParams, options?: Partial<NavigateOptions>) => void];
export declare function createRoutes(routeDef: RouteDefinition, base?: string, fallback?: () => Child): Route[];
export declare function createBranch(routes: Route[], index?: number): Branch;
export declare function createBranches(routeDef: FunctionMaybe<RouteDefinition | RouteDefinition[]>, base?: string, fallback?: () => Child, stack?: Route[], branches?: Branch[]): Branch[];
export declare function getRouteMatches(branches: Branch[], location: string): RouteMatch[];
export declare function createLocation(path: ObservableReadonly<string>, state: ObservableReadonly<unknown>): Location;
export declare function createRouterContext(integration?: RouterIntegration | LocationChangeSignal, base?: string, data?: RouteDataFunc, out?: object): RouterContext;
export declare function createRouteContext(router: RouterContext, parent: RouteContext, child: () => RouteContext, match: () => RouteMatch): RouteContext;
//# sourceMappingURL=routing.d.ts.map