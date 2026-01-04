# Voby

A high-performance framework with fine-grained observable/signal-based reactivity for building rich applications.

## Why Voby

- **No VDOM**: direct DOM updates, no diffing
- **No stale closures**: functions always run fresh
- **No hooks rules**: hooks are plain functions, nest/call conditionally
- **No dependency arrays**: dependencies tracked automatically
- **No key prop**: just map arrays or use `For` with unique values
- **Local-first**: no SSR/hydration/streaming (focused on rich client apps)

## Mental Model

### Observables are Functions

```tsx
import { $, get } from 'voby';

const count = $(0);       // Create observable
count();                  // Read: 0
count(1);                 // Write: 1
count(v => v + 1);        // Update: 2
get(count);               // Unwrap: 2 (works on any value)
```

### Reactivity is Automatic

```tsx
import { $, useEffect, useMemo } from 'voby';

const a = $(1);
const b = $(2);
const sum = useMemo(() => a() + b());  // Auto-tracks a, b

useEffect(() => {
  console.log(sum());  // Re-runs when sum changes
});
```

### Components Return Children

Components are functions that return `Child` (nodes, strings, arrays, functions).

```tsx
const Counter = () => {
  const count = $(0);
  return (
    <button onClick={() => count(v => v + 1)}>
      Count: {count}
    </button>
  );
};
```

## Quick Start

```tsx
import { $, render } from 'voby';

const App = () => {
  const count = $(0);
  return (
    <button onClick={() => count(v => v + 1)}>
      Count: {count}
    </button>
  );
};

render(<App />, document.getElementById('app')!);
```

## Core API

### Reactivity

| API | Description |
|-----|-------------|
| `$(value)` | Create observable |
| `get(value)` | Unwrap observable/function to raw value |
| `useEffect(fn)` | Run side effect when dependencies change |
| `useMemo(fn)` | Create derived readonly observable |
| `useCleanup(fn)` | Register cleanup when computation disposes |
| `untrack(fn)` | Execute without tracking dependencies |
| `batch(fn)` | Batch updates (useful for async) |

### Rendering

| API | Description |
|-----|-------------|
| `render(child, parent)` | Mount component, returns disposer |
| `createElement(tag, props, ...children)` | Create element (used by JSX) |
| `Dynamic` | Dynamic component: `<Dynamic component={tag}>` |

### Context

`createContext` returns a `[Provider, use]` pair:

```tsx
// Factory pattern (per-provider instance)
const [Provider, useCounter] = createContext((props: { value?: number }) => ({
  count: $(props.value ?? 0)
}));

// Shared value pattern (singleton)
const [Provider, useConfig] = createContext({ theme: $<'light'|'dark'>('light') });

// Usage
<Provider value={1}>
  {() => {
    const { count } = useCounter();
    return <button onClick={() => count(v => v + 1)}>{count}</button>;
  }}
</Provider>
```

### Control Flow Components

Use these instead of JS control flow for reactive updates:

```tsx
import { If, For } from 'voby';

// Conditional
<If when={visible}>
  <p>Shown when truthy</p>
</If>

<If when={user} fallback={<p>Loading...</p>}>
  {(u) => <p>Hello {u().name}</p>}
</If>

// List (requires unique values)
<For values={items} fallback={<p>Empty</p>}>
  {(item, index) => <li>{item}</li>}
</For>

```

### Composition with `renderElement`

Base UI-style composition via `render` prop:

```tsx
import { renderElement } from 'voby';

const DialogTrigger = (props) => {
  const open = $(false);
  return renderElement('button', props, {
    state: { open },
    props: {
      onClick: () => open(v => !v),
      'data-open': () => open() ? '' : undefined
    }
  });
};

// Usage - render prop can be tag, function, or DOM node
<DialogTrigger render="a" href="#" />
<DialogTrigger render={(props, state) => <CustomButton {...props} />} />
```

- Event handlers merge: external runs first, call `event.preventVobyHandler()` to skip internal
- `class`, `style`, `ref` are merged

### Async & Suspense

```tsx
import { useResource, Suspense, lazy } from 'voby';

// Resource (auto-tracks, triggers Suspense)
const resource = useResource(() => fetch('/api').then(r => r.json()));
// resource().pending, resource().error, resource().value

// Lazy loading
const LazyComponent = lazy(() => import('./Component'));

// Suspense boundary
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

## JSX Differences from React

- Use `class` instead of `className`
- `class` accepts string, object `{active: bool}`, or array
- Attribute values can be observables or functions (fine-grained updates)
- `ref` must be function form: `ref={el => ...}` or `ref={[fn1, fn2]}`
- Refs called on next microtask (node likely attached to DOM)
- No `key` prop needed
- `style` numbers auto-suffixed with `px`, CSS vars supported
- `dangerouslySetInnerHTML` supported (not innerHTML)
- Delegated events: `click`, `input`, `keydown`, `keyup`, `mousedown`, `mouseup`, `dblclick`, `focusin`, `focusout`, `beforeinput`

## Stores (Deep Reactivity)

```tsx
import { store, isStore } from 'voby';

const state = store({ user: { name: 'John' }, items: [] });
state.user.name = 'Jane';  // Reactive write
state.items.push('item');  // Reactive array mutation
```

## Router

```tsx
import { lazy } from 'voby';
import { Router, Routes, Route, A, Outlet, Navigate } from 'voby/router';
import { useParams, useNavigate, useLocation, useSearchParams, useRouteData } from 'voby/router';

const Home = lazy(() => import('./pages/Home'));
const Users = lazy(() => import('./pages/Users'));
const User = lazy(() => import('./pages/User'));

// Basic routing
render(
  <Router>
    <nav>
      <A href="/">Home</A>
      <A href="/users" end>Users</A>  {/* end: exact match only */}
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User />} />
      <Route path="/*" element={<NotFound />} />  {/* Wildcard */}
    </Routes>
  </Router>,
  document.getElementById('app')!
);

// Nested routes with layout
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="/" element={<Overview />} />
  <Route path="/settings" element={<Settings />} />
</Route>

const DashboardLayout = () => (
  <div class="dashboard">
    <Sidebar />
    <Outlet />  {/* Child routes render here */}
  </div>
);

// Dynamic params
const User = () => {
  const params = useParams();  // { id: '123' }
  const resource = useResource(() => fetchUser(params.id));
  return <div>{resource().value?.name}</div>;
};

// Navigation
const navigate = useNavigate();
navigate('/users/123');
navigate('/login', { replace: true });
navigate(-1);  // Back

// Location & search params
const location = useLocation();  // { pathname, search, hash, state }
const [searchParams, setSearchParams] = useSearchParams();
setSearchParams({ page: 2, sort: 'name' });  // ?page=2&sort=name

// Data functions (parallel loading)
function UserData({ params }) {
  return useResource(() => fetchUser(params.id));
}
<Route path="/users/:id" element={<User />} data={UserData} />

const User = () => {
  const user = useRouteData();
  return <h1>{user().value?.name}</h1>;
};

// Programmatic redirect
<Route path="/old-path" element={<Navigate href="/new-path" />} />

// Config-based routing
const routes = [
  { path: '/', component: Home },
  { path: '/users/:id', component: User, children: [
    { path: '/', component: UserProfile },
    { path: '/settings', component: UserSettings },
  ]},
];
const Routes = useRoutes(routes);
```

See [docs/router.md](docs/router.md) for `A` props, `useMatch`, and edge cases.

## Other Utilities

| API | Description |
|-----|-------------|
| `Portal` | Render children in different DOM location |
| `ErrorBoundary` | Catch errors with fallback |
| `KeepAlive` | Cache component instances |
| `template(fn)` | Optimize static component instantiation |
| `html\`...\`` | Tagged template alternative to JSX |
| `isObservable(v)` | Check if value is observable |
| `isServer()` | Check if running server-side |

## Detailed Reference

- [API Reference](docs/api-reference.md) - Complete methods, components, hooks, types
- [Router](docs/router.md) - Nested routes, data functions, all primitives
