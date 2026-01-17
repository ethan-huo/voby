# Voby

A high-performance framework with fine-grained observable-based reactivity for rich client apps.

## Why Voby

- No VDOM: direct DOM updates, no diffing
- No stale closures: functions always run fresh
- No hooks rules: hooks are plain functions, call anywhere
- No dependency arrays: automatic tracking
- No key prop: map arrays or use `For` with unique values
- Local-first: no SSR/hydration/streaming (by design)

## Mental Model

### Observables are functions

```tsx
import { $, get } from 'voby';

const count = $(0);       // create observable
count();                  // read: 0
count(1);                 // write: 1
count(v => v + 1);        // update: 2
get(count);               // unwrap: 2 (works on any value)
```

### Reactivity is automatic

```tsx
import { $, useEffect, useMemo } from 'voby';

const a = $(1);
const b = $(2);
const sum = useMemo(() => a() + b());

useEffect(() => {
  console.log(sum());
});
```

### Components return children

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

## Router (voby/router)

```tsx
import { lazy, render } from 'voby';
import { Router, Routes, Route, A, Outlet, Navigate } from 'voby/router';
import { useParams, useNavigate, useLocation, useSearchParams, useRouteData } from 'voby/router';

const Home = lazy(() => import('./pages/Home'));
const Users = lazy(() => import('./pages/Users'));
const User = lazy(() => import('./pages/User'));

render(
  <Router>
    <nav>
      <A href="/">Home</A>
      <A href="/users" end>Users</A>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  </Router>,
  document.getElementById('app')!
);

const DashboardLayout = () => (
  <div class="dashboard">
    <Sidebar />
    <Outlet />
  </div>
);

<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="/" element={<Overview />} />
  <Route path="/settings" element={<Settings />} />
</Route>

const UserPage = () => {
  const params = useParams();
  const user = useResource(() => fetchUser(params.id));
  return <div>{user().value?.name}</div>;
};

const navigate = useNavigate();
navigate('/users/123');

const location = useLocation();
const [searchParams, setSearchParams] = useSearchParams();
setSearchParams({ page: 2, sort: 'name' });

<Route path="/old" element={<Navigate href="/new" />} />
```

See `docs/router.md` for full router docs and edge cases.

## Async & Suspense

```tsx
import { useResource, Suspense, lazy } from 'voby';

const [resource] = useResource(() => fetch('/api').then(r => r.json()));
const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

## Stores (Deep Reactivity)

```tsx
import { store } from 'voby';

const state = store({ user: { name: 'John' }, items: [] });
state.user.name = 'Jane';
state.items.push('item');
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

## API Index (All Public API)

### Methods

| API | Notes |
| --- | --- |
| `$` | create observable |
| `get` | unwrap observable/function |
| `batch` | batch updates |
| `createContext` | context factory |
| `createElement` | JSX factory |
| `h` | hyperscript helper |
| `hmr` | hot module helper |
| `html` | tagged template JSX alternative |
| `isBatching` | batching state |
| `isObservable` | observable check |
| `isServer` | server env check |
| `isStore` | store check |
| `lazy` | code-split component |
| `mergeProps` | merge props (composition) |
| `mergePropsN` | merge props (N inputs) |
| `mergeRefs` | merge refs |
| `render` | mount app |
| `renderElement` | base UI composition |
| `renderToString` | client-side string render |
| `resolve` | normalize functions to memos |
| `store` | deep reactive store |
| `template` | static template optimization |
| `tick` | flush effects |
| `untrack` | read without tracking |

### Components

| API | Notes |
| --- | --- |
| `Dynamic` | dynamic component/element |
| `ErrorBoundary` | error isolation |
| `For` | keyed list rendering |
| `Fragment` | JSX fragment |
| `If` | reactive conditional |
| `KeepAlive` | component cache |
| `Portal` | render elsewhere |
| `Suspense` | async boundary |

### Hooks

| API | Notes |
| --- | --- |
| `useAbortController` | AbortController helper |
| `useAbortSignal` | AbortSignal helper |
| `useAnimationFrame` | RAF scheduler |
| `useAnimationLoop` | RAF loop |
| `useBoolean` | boolean observable |
| `useCleanup` | cleanup on dispose |
| `useDisposed` | reactive disposed flag |
| `useEffect` | reactive effect |
| `useEventListener` | DOM event helper |
| `useFetch` | fetch wrapped as resource |
| `useIdleCallback` | idle callback |
| `useIdleLoop` | idle loop |
| `useInterval` | interval helper |
| `useMemo` | derived observable |
| `useMicrotask` | microtask helper |
| `usePromise` | promise resource |
| `useReadonly` | readonly view |
| `useResolved` | unwrap values/tuples |
| `useResource` | async resource with mutate/refetch |
| `useRoot` | isolated root |
| `useSelector` | optimized selector |
| `useSuspended` | Suspense state |
| `useTimeout` | timeout helper |
| `useUntracked` | return untracked function |

### Types

| API | Notes |
| --- | --- |
| `EffectOptions` | effect options |
| `FunctionMaybe` | value or function |
| `MemoOptions` | memo options |
| `Observable` | writable observable |
| `ObservableLike` | observable-like |
| `ObservableReadonly` | readonly observable |
| `ObservableReadonlyLike` | readonly observable-like |
| `ObservableMaybe` | observable or value |
| `ObservableOptions` | observable options |
| `Resource` | resource shape |
| `StoreOptions` | store options |
| `JSX` | JSX types (from runtime) |

### JSX Runtime

| API | Notes |
| --- | --- |
| `jsx` / `jsxs` / `jsxDEV` | JSX runtime exports |
| `Fragment` | JSX fragment |

## Key APIs (Differences Worth Knowing)

### `useResource`

A Solid-style resource with `mutate`/`refetch`, tracked source, and Suspense integration.

```tsx
const [todos, { mutate, refetch }] = useResource(getTodos);

mutate(prev => (prev ? prev.concat(newTodo) : [newTodo]));
refetch();
```

- `mutate` updates value without fetching
- `refetch` re-runs fetcher (optionally with custom info)
- pending state can trigger `Suspense`

Best practice: use a source gate that returns `null`/`undefined`/`false` to
skip fetching; the fetcher receives the non-null value.

```tsx
const [todos] = useResource(
  () => user() ?? null,
  (u) => fetchTodos(u.id),
);
```

Common mistake: calling `useResource` with a source and then making the
fetcher accept `null` just to satisfy types. Keep the gate in the source and
handle empty state in UI instead.

See `docs/resource.md` for behavior details.

### `createContext`

Context should be initialized per Provider. Prefer factory form:

```tsx
const [AppProvider, useApp] = createContext((props: { initial?: number }) => ({
  count: $(props.initial ?? 0),
}));
```

If you need to inject a value, use the explicit value prop:

```tsx
const [AppProvider, useApp] = createContext<{ theme: Observable<string> }>();
// <AppProvider value={{ theme: $("light") }}>{...}
```

Common mistake: creating state outside and passing it as `createContext(state)`.
That runs immediately at module load and defeats per-Provider initialization.

### `renderElement`

Base UI composition with render-prop support and merged props/handlers.

```tsx
import { renderElement, $ } from 'voby';

const DialogTrigger = (props) => {
  const open = $(false);
  return renderElement('button', props, {
    state: { open },
    props: {
      onClick: () => open(v => !v),
      'data-open': () => (open() ? '' : undefined)
    }
  });
};
```

### `Suspense`

Local-only Suspense. No SSR/hydration. Use for async boundaries and lazy components.

## Docs Index

- `docs/index.md`
- `docs/api-reference.md`
- `docs/hooks.md`
- `docs/resource.md`
- `docs/router.md`
