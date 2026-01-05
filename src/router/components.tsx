import type { JSX } from '../jsx/types'
import type { FunctionMaybe, Child } from '../types'
import type {
	Location,
	LocationChangeSignal,
	Navigator,
	RouteContext,
	RouteDataFunc,
	RouteDefinition,
	RouteMatch,
	RouterIntegration,
} from './types'

import { ErrorBoundary, If, get, useEffect, useMemo } from '../'
import { isFunction } from '../utils/lang'
import { pathIntegration } from './integration'
import {
	createBranches,
	createRouteContext,
	createRouterContext,
	getRouteMatches,
	RouteContextProvider,
	RouterContextProvider,
	useHref,
	useLocation,
	useNavigate,
	useResolvedPath,
	useRoute,
	useRouter,
} from './routing'
import { joinPaths, on } from './utils'

export type RouterProps = {
	base?: string
	data?: RouteDataFunc
	children: Child
	out?: object
} & (
	| {
			url?: never
			source?: RouterIntegration | LocationChangeSignal
	  }
	| {
			source?: never
			url: string
	  }
)

export const Router = (props: RouterProps) => {
	const { source, base, data, out } = props
	const integration = source || pathIntegration()
	const routerState = createRouterContext(integration, base, data, out)

	return (
		<RouterContextProvider value={routerState}>
			<RouteContextProvider value={routerState.base}>
				{props.children}
			</RouteContextProvider>
		</RouterContextProvider>
	)
}

export type RoutesProps = {
	base?: string
	children: Child
	errorFallback?:
		| Child
		| ((props: { error: Error; reset: () => void }) => Child)
}

export const Routes = (props: RoutesProps) => {
	const router = useRouter()
	const parentRoute = useRoute()
	const branches = useMemo(() =>
		createBranches(
			props.children as unknown as FunctionMaybe<
				RouteDefinition | RouteDefinition[]
			>,
			joinPaths(parentRoute.pattern, props.base || ''),
			Outlet,
		),
	)
	const matches = useMemo(() =>
		getRouteMatches(branches(), router.location.pathname),
	)

	let resetError: (() => void) | undefined

	useEffect(() => {
		// Reset error boundary on navigation so routing keeps working.
		router.location.pathname
		resetError?.()
		resetError = undefined
	})

	if (router.out) {
		router.out.matches.push(
			matches().map(({ route, path, params }: RouteMatch) => ({
				originalPath: route.originalPath,
				pattern: route.pattern,
				path,
				params,
			})),
		)
	}

	let root: RouteContext | undefined
	let prevMatches: RouteMatch[] | undefined
	let prev: RouteContext[] | undefined

	const routeStates = useMemo(
		on(matches, () => {
			let equal = matches().length === prevMatches?.length
			const next: RouteContext[] = []
			for (let i = 0, len = matches().length; i < len; i++) {
				const prevMatch = prevMatches?.[i]
				const nextMatch = matches()[i]

				if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
					next[i] = prev[i]
				} else {
					equal = false
					next[i] = createRouteContext(
						router,
						next[i - 1] || parentRoute,
						() => routeStates()[i + 1],
						() => matches()[i],
					)
				}
			}

			if (prev && equal) return prev
			root = next[0]
			prevMatches = [...matches()]
			prev = [...next]
			return next
		}),
	)

	const fallback =
		props.errorFallback ||
		(({ error, reset }) => (
			<div style={{ padding: '1rem' }}>
				<h2 style={{ color: 'crimson', margin: '0 0 0.5rem 0' }}>
					Something went wrong
				</h2>
				<pre style={{ color: 'crimson', whiteSpace: 'pre-wrap' }}>
					{String(error)}
				</pre>
				<button onClick={reset} style={{ marginTop: '0.75rem' }}>
					Try again
				</button>
			</div>
		))

	return (
		<If when={() => routeStates() && root}>
			{(route: () => RouteContext) => (
				<RouteContextProvider value={route()}>
					<ErrorBoundary
						fallback={(props) => {
							resetError = props.reset
							return isFunction(fallback) ? fallback(props) : fallback
						}}
					>
						{() => route().outlet()}
					</ErrorBoundary>
				</RouteContextProvider>
			)}
		</If>
	)
}

export const useRoutes =
	(routes: RouteDefinition | RouteDefinition[], base?: string) => () => (
		<Routes base={base}>{routes as unknown as Child}</Routes>
	)

export type RouteProps = {
	path: string | string[]
	children?: Child
	data?: RouteDataFunc
} & (
	| {
			element?: never
			component: () => Child
	  }
	| {
			component?: never
			element?: Child
			preload?: () => void
	  }
)

export const Route = (props: RouteProps) => props as unknown as Child

export const Outlet = () => {
	const route = useRoute()
	return (
		<If when={() => route.child}>
			{(child: () => RouteContext) => (
				<RouteContextProvider value={child()}>
					{() => child().outlet()}
				</RouteContextProvider>
			)}
		</If>
	)
}

// interface LinkBaseProps
//   extends Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'state'> {
//   to: string | undefined;
//   state?: unknown;
// }

// function LinkBase({ children, to, href, state, ...rest }: LinkBaseProps) {
//   return (
//     <a
//       {...rest}
//       href={useHref(() => to)() || href}
//       state={JSON.stringify(state)}
//     >
//       {children}
//     </a>
//   );
// }

export type AnchorProps = Omit<
	JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
	'state' | 'href'
> & {
	href: FunctionMaybe<string>
	replace?: boolean
	noScroll?: boolean
	state?: unknown
	inactiveClass?: string
	activeClass?: string
	end?: boolean
}

export function A(props: AnchorProps) {
	const {
		activeClass = 'active',
		inactiveClass = 'inactive',
		children,
		class: class_,
		end,
		href,
		state,
		...rest
	} = props
	const to = useResolvedPath(() => get(href))
	const location = useLocation()
	const isActive = useMemo(() => {
		const to_ = to()
		if (to_ === undefined) return false
		const path = to_.split(/[?#]/, 1)[0].toLowerCase()
		const loc = location.pathname.toLowerCase()
		return end ? path === loc : loc.startsWith(path)
	})

	return (
		<a
			link
			{...rest}
			href={useHref(to)() ?? get(href)}
			state={JSON.stringify(state)}
			class={() => [
				{
					[inactiveClass]: !isActive(),
					[activeClass]: isActive(),
				},
				class_,
			]}
			aria-current={() => (isActive() ? 'page' : undefined)}
		>
			{children}
		</a>
	)
}

// deprecated alias exports
export { A as Link, A as NavLink }
export type { AnchorProps as LinkProps, AnchorProps as NavLinkProps }

export type NavigateProps = {
	href: ((args: { navigate: Navigator; location: Location }) => string) | string
	state?: unknown
}

export function Navigate(props: NavigateProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const { href, state } = props
	const path = typeof href === 'function' ? href({ navigate, location }) : href
	navigate(path, { replace: true, state })
	return null
}
