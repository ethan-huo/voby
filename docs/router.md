# Voby Router

Port of [Solid Router](https://github.com/solidjs/solid-app-router). See [README](../readme.md#router) for basic usage.

```sh
npm i voby/router
```

## `A` Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | Path to navigate (relative to current route, or absolute with `/`) |
| `end` | `boolean` | `false` | Exact match only (important for `/` to not match everything) |
| `replace` | `boolean` | `false` | Replace history entry instead of push |
| `noScroll` | `boolean` | `false` | Don't scroll to top |
| `state` | `unknown` | - | Push to history state |
| `activeClass` | `string` | `'active'` | Class when href matches |
| `inactiveClass` | `string` | `'inactive'` | Class when href doesn't match |

## `Navigate` Component

Immediate redirect on render. `href` can be string or function:

```tsx
<Navigate href={({ location }) => location.pathname === '/old' ? '/new' : '/home'} />
```

## Route Patterns

```tsx
// Static
<Route path="/about" />

// Dynamic param
<Route path="/users/:id" />  // params.id

// Optional param
<Route path="/users/:id?" />

// Wildcard (must be last segment)
<Route path="/files/*" />           // Unnamed
<Route path="/files/*filepath" />   // params.filepath

// Multiple params
<Route path="/org/:orgId/repo/:repoId" />
```

## Nested Routes Gotcha

Only **leaf nodes** become routes. Parent with `element` + children doesn't work as expected:

```tsx
// WRONG: /users renders nothing, only /users/:id works
<Route path="/users" element={<Users />}>
  <Route path="/:id" element={<User />} />
</Route>

// RIGHT: Separate routes
<Route path="/users" element={<Users />} />
<Route path="/users/:id" element={<User />} />

// RIGHT: Explicit leaf for parent
<Route path="/users">
  <Route path="/" element={<Users />} />
  <Route path="/:id" element={<User />} />
</Route>

// RIGHT: Layout with Outlet
<Route path="/users" element={<Layout />}>
  <Route path="/" element={<Users />} />
  <Route path="/:id" element={<User />} />
</Route>

const Layout = () => <div><Outlet /></div>;
```

## Data Functions

Parallel data loading (render-as-you-fetch):

```tsx
function UserData({ params, location, navigate, data }) {
  // `data` is parent route's data (for nested routes)
  return useResource(() => fetchUser(params.id));
}

<Route path="/users/:id" element={<User />} data={UserData} />

// In component
const user = useRouteData();
```

Recommended: Export data function from `[id].data.ts` for code-splitting.

## Hooks Reference

| Hook | Returns | Description |
|------|---------|-------------|
| `useParams()` | `Record<string, string>` | Route params object |
| `useLocation()` | `{ pathname, search, hash, query, state, key }` | Reactive location |
| `useNavigate()` | `(to, options?) => void` | Navigation function |
| `useSearchParams()` | `[params, setParams]` | Query string as reactive proxy |
| `useRouteData()` | `T` | Data function return value |
| `useMatch(() => path)` | `() => MatchResult \| undefined` | Check if path matches |
| `useRoutes(config)` | `Component` | Config-based routing |

### `useNavigate` Options

```ts
navigate(path, {
  resolve: true,   // Resolve relative to current route
  replace: false,  // Replace instead of push
  scroll: true,    // Scroll to top
  state: undefined // History state
});
```

### `useSearchParams` Behavior

```tsx
const [params, setParams] = useSearchParams();

params.page;  // Read (reactive)

setParams({ page: 2 });           // Merge
setParams({ filter: undefined }); // Remove key
setParams({ page: 1 }, { replace: true, scroll: false });
```

## Config-Based Routes

```tsx
const routes = [
  {
    path: '/users/:id',
    component: lazy(() => import('./User')),
    data: UserData,
    children: [
      { path: '/', component: UserProfile },
      { path: '/settings', component: UserSettings },
      { path: '/*all', component: NotFound },
    ],
  },
];

const Routes = useRoutes(routes);
return <Routes />;
```
