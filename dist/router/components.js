import { jsx as _jsx, jsxs as _jsxs } from "voby/jsx-runtime";
import { ErrorBoundary, If, get, useEffect, useMemo } from '../';
import { isFunction } from '../utils/lang';
import { pathIntegration } from './integration';
import { createBranches, createRouteContext, createRouterContext, getRouteMatches, RouteContextProvider, RouterContextProvider, useHref, useLocation, useNavigate, useResolvedPath, useRoute, useRouter, } from './routing';
import { joinPaths, on } from './utils';
export const Router = (props) => {
    const { source, base, data, out } = props;
    const integration = source || pathIntegration();
    const routerState = createRouterContext(integration, base, data, out);
    return (_jsx(RouterContextProvider, { value: routerState, children: _jsx(RouteContextProvider, { value: routerState.base, children: props.children }) }));
};
export const Routes = (props) => {
    const router = useRouter();
    const parentRoute = useRoute();
    const branches = useMemo(() => createBranches(props.children, joinPaths(parentRoute.pattern, props.base || ''), Outlet));
    const matches = useMemo(() => getRouteMatches(branches(), router.location.pathname));
    let resetError;
    useEffect(() => {
        // Reset error boundary on navigation so routing keeps working.
        router.location.pathname;
        resetError?.();
        resetError = undefined;
    });
    if (router.out) {
        router.out.matches.push(matches().map(({ route, path, params }) => ({
            originalPath: route.originalPath,
            pattern: route.pattern,
            path,
            params,
        })));
    }
    let root;
    let prevMatches;
    let prev;
    const routeStates = useMemo(on(matches, () => {
        let equal = matches().length === prevMatches?.length;
        const next = [];
        for (let i = 0, len = matches().length; i < len; i++) {
            const prevMatch = prevMatches?.[i];
            const nextMatch = matches()[i];
            if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
                next[i] = prev[i];
            }
            else {
                equal = false;
                next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i]);
            }
        }
        if (prev && equal)
            return prev;
        root = next[0];
        prevMatches = [...matches()];
        prev = [...next];
        return next;
    }));
    const fallback = props.errorFallback ||
        (({ error, reset }) => (_jsxs("div", { style: { padding: '1rem' }, children: [_jsx("h2", { style: { color: 'crimson', margin: '0 0 0.5rem 0' }, children: "Something went wrong" }), _jsx("pre", { style: { color: 'crimson', whiteSpace: 'pre-wrap' }, children: String(error) }), _jsx("button", { onClick: reset, style: { marginTop: '0.75rem' }, children: "Try again" })] })));
    return (_jsx(If, { when: () => routeStates() && root, children: (route) => (_jsx(RouteContextProvider, { value: route(), children: _jsx(ErrorBoundary, { fallback: (props) => {
                    resetError = props.reset;
                    return isFunction(fallback) ? fallback(props) : fallback;
                }, children: () => route().outlet() }) })) }));
};
export const useRoutes = (routes, base) => () => (_jsx(Routes, { base: base, children: routes }));
export const Route = (props) => props;
export const Outlet = () => {
    const route = useRoute();
    return (_jsx(If, { when: () => route.child, children: (child) => (_jsx(RouteContextProvider, { value: child(), children: () => child().outlet() })) }));
};
export function A(props) {
    const { activeClass = 'active', inactiveClass = 'inactive', children, class: class_, end, href, state, ...rest } = props;
    const to = useResolvedPath(() => get(href));
    const location = useLocation();
    const isActive = useMemo(() => {
        const to_ = to();
        if (to_ === undefined)
            return false;
        const path = to_.split(/[?#]/, 1)[0].toLowerCase();
        const loc = location.pathname.toLowerCase();
        return end ? path === loc : loc.startsWith(path);
    });
    return (_jsx("a", { link: true, ...rest, href: useHref(to)() ?? get(href), state: JSON.stringify(state), class: () => [
            {
                [inactiveClass]: !isActive(),
                [activeClass]: isActive(),
            },
            class_,
        ], "aria-current": () => (isActive() ? 'page' : undefined), children: children }));
}
// deprecated alias exports
export { A as Link, A as NavLink };
export function Navigate(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { href, state } = props;
    const path = typeof href === 'function' ? href({ navigate, location }) : href;
    navigate(path, { replace: true, state });
    return null;
}
//# sourceMappingURL=components.js.map