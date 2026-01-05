import type { JSX } from '../jsx/types';
import type { FunctionMaybe, Child } from '../types';
import type { Location, LocationChangeSignal, Navigator, RouteDataFunc, RouteDefinition, RouterIntegration } from './types';
export type RouterProps = {
    base?: string;
    data?: RouteDataFunc;
    children: Child;
    out?: object;
} & ({
    url?: never;
    source?: RouterIntegration | LocationChangeSignal;
} | {
    source?: never;
    url: string;
});
export declare const Router: (props: RouterProps) => JSX.Child;
export type RoutesProps = {
    base?: string;
    children: Child;
    errorFallback?: Child | ((props: {
        error: Error;
        reset: () => void;
    }) => Child);
};
export declare const Routes: (props: RoutesProps) => JSX.Child;
export declare const useRoutes: (routes: RouteDefinition | RouteDefinition[], base?: string) => () => JSX.Child;
export type RouteProps = {
    path: string | string[];
    children?: Child;
    data?: RouteDataFunc;
} & ({
    element?: never;
    component: () => Child;
} | {
    component?: never;
    element?: Child;
    preload?: () => void;
});
export declare const Route: (props: RouteProps) => Child;
export declare const Outlet: () => JSX.Child;
export type AnchorProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'state' | 'href'> & {
    href: FunctionMaybe<string>;
    replace?: boolean;
    noScroll?: boolean;
    state?: unknown;
    inactiveClass?: string;
    activeClass?: string;
    end?: boolean;
};
export declare function A(props: AnchorProps): JSX.Child;
export { A as Link, A as NavLink };
export type { AnchorProps as LinkProps, AnchorProps as NavLinkProps };
export type NavigateProps = {
    href: ((args: {
        navigate: Navigator;
        location: Location;
    }) => string) | string;
    state?: unknown;
};
export declare function Navigate(props: NavigateProps): null;
//# sourceMappingURL=components.d.ts.map