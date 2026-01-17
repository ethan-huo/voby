# API Reference

## Table of Contents

- [Methods](#methods)
- [Components](#components)
- [Hooks (Core)](#hooks-core)
- [Hooks (Web)](#hooks-web)
- [Types](#types)

---

## Methods

### `$`

Create an observable.

```ts
function $<T>(): Observable<T | undefined>;
function $<T>(value: T, options?: ObservableOptions<T>): Observable<T>;
```

```tsx
const count = $(0);
count(); // Read: 0
count(1); // Write: 1
count((v) => v + 1); // Update function
const fn = $(() => () => {}); // Store function (wrap in another function)

// Custom equality
$(1, { equals: (a, b) => a === b });
$(1, { equals: false }); // Always emit on set
```

### `get`

Unwrap potentially observable value.

```ts
function get<T>(value: T, deep?: boolean): Unwrapped<T>;
```

```tsx
get($(123)); // 123
get(() => 123); // 123
get(123); // 123
get(o, false); // Unwrap observable but not function
```

### `batch`

Batch updates, delay effects until resolved. Useful for async operations.

```ts
function batch<T>(fn: () => Promise<T> | T): Promise<Awaited<T>>;
```

### `untrack`

Execute without tracking dependencies.

```ts
function untrack<T>(fn: () => T): T;
```

### `tick`

Force pending effects to execute immediately.

```ts
function tick(): void;
```

### `resolve`

Replace functions with memos. Used internally for proper tracking.

```ts
function resolve<T>(value: T): T;
```

### `createContext`

Create context provider and hook pair.

```ts
// Shared value (singleton)
function createContext<T, P>(
  init: (props: P) => T,
  name?: string
): [ContextProvider<P>, () => T | undefined];
```

```tsx
// Factory pattern
const [Provider, useCounter] = createContext((props: { initial?: number }) => ({
  count: $(props.initial ?? 0),
}));

// Value-in (explicit)
const [Provider, useTheme] = createContext<{ theme: Observable<string> }>();
// <Provider value={{ theme: $("light") }}>{...}

// Note: context values must be non-null. If you need "empty" state, wrap it:
// value={{ user: null }}

// If init throws, Provider renders an error message instead of children.
```

### `createElement` / `h`

Create elements (called by JSX automatically).

```ts
function createElement<P>(
  component: Component<P>,
  props: P | null,
  ...children: Child[]
): () => Element;
const h = createElement; // Alias for hyperscript style
```

### `render`

Mount component, returns disposer.

```ts
function render(child: Child, parent?: HTMLElement | null): Disposer;
```

```tsx
const dispose = render(<App />, document.getElementById("app"));
dispose(); // Unmount and stop reactivity
```

### `renderToString`

Render to HTML string. Waits for Suspense. Requires browser-like env (JSDOM for SSR).

```ts
function renderToString(child: Child): Promise<string>;
```

### `mergeProps`

Merge props objects. External overrides internal. Events, class, style, ref are merged.

```ts
function mergeProps(...props: Props[]): Props;
```

```tsx
const merged = mergeProps(
  { class: "internal", onClick: () => console.log("internal") },
  { class: "external", onClick: (e) => e.preventVobyHandler?.() }
);
// Result: class merged, external onClick runs first
```

### `renderElement`

Base UI-style composition via render prop.

```ts
function renderElement<State>(
  component: Component,
  componentProps?: Props & { render?: RenderProp<State> },
  params?: { enabled?: boolean; props?: Props; ref?: Ref; state?: State }
): Child;
```

```tsx
const Button = (props) =>
  renderElement("button", props, {
    state: { pressed: isPressed() },
    props: { "data-pressed": () => (isPressed() ? "" : undefined) },
  });
```

### `store`

Create deeply reactive proxy.

```ts
function store<T>(value: T, options?: StoreOptions): T;
```

```tsx
const state = store({ user: { name: "John" }, items: [] });
state.user.name = "Jane"; // Reactive
state.items.push("item"); // Reactive
```

### `template`

Wrap component for optimized instantiation (no hooks inside).

```ts
function template<P>(fn: (props: P) => Element): (props: P) => () => Element;
```

### `lazy`

Lazy-load component. Triggers Suspense.

```ts
function lazy<P>(
  fetcher: () => Promise<{ default: Component<P> } | Component<P>>
): LazyComponent<P>;
```

```tsx
const LazyPage = lazy(() => import("./Page"));
LazyPage.preload(); // Optional preload
```

### `html`

Tagged template literal alternative to JSX.

```tsx
import { html, If } from "voby";

const Counter = () => {
  const count = $(0);
  return html` <button onClick=${() => count((v) => v + 1)}>${count}</button> `;
};

// Register components for cleaner syntax
html.register({ If });
```

### `hmr`

HMR wrapper for Vite. See [voby-vite](https://github.com/vobyjs/voby-vite) for automated solution.

```tsx
export default hmr(import.meta.hot?.accept?.bind(import.meta.hot), Counter);
```

### Utility Checks

```ts
function isObservable<T>(value: unknown): value is Observable<T>;
function isStore(value: unknown): boolean;
function isServer(): boolean;
function isBatching(): boolean;
```

---

## Components

### `Dynamic`

Render dynamic component/tag.

```tsx
<Dynamic component={isButton ? "button" : "a"} {...props}>
  Content
</Dynamic>
```

### `If`

Reactive conditional rendering.

```tsx
<If when={condition} fallback={<Fallback />}>
  <Content />
</If>

// Access truthy value
<If when={user}>
  {(u) => <p>Hello {u().name}</p>}
</If>
```

### `For`

Reactive list rendering. Values must be unique (keyed by default).

```tsx
// Keyed (default) - value is T
<For values={items} fallback={<Empty />}>
  {(item, index) => <Item data={item} />}
</For>

// Unkeyed - value is Observable<T>
<For values={items} unkeyed>
  {(item$, index) => <Item data={item$()} />}
</For>

// Pooled - reuse DOM nodes
<For values={items} unkeyed pooled>
  {(item$) => <Item data={item$()} />}
</For>
```

### `Suspense`

Show fallback while resources load.

```tsx
<Suspense when={manualCondition} fallback={<Spinner />}>
  <AsyncContent />
</Suspense>
```

### `ErrorBoundary`

Catch errors with fallback.

```tsx
<ErrorBoundary
  fallback={({ error, reset }) => (
    <>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </>
  )}
>
  <MayThrow />
</ErrorBoundary>
```

### `Portal`

Render in different DOM location.

```tsx
<Portal
  mount={document.body}
  when={true}
  wrapper={<div class="portal-wrapper" />}
>
  <Modal />
</Portal>
```

### `KeepAlive`

Cache component instances.

```tsx
<KeepAlive id="expensive-component" ttl={60000}>
  <ExpensiveComponent />
</KeepAlive>
```

### `Fragment`

Group children (same as `<>...</>`).

---

## Hooks (Core)

### `useEffect`

Run side effect on dependency changes. Return cleanup function.

```ts
function useEffect(
  fn: () => (() => void) | void,
  options?: EffectOptions
): Disposer;
```

```tsx
useEffect(() => {
  const handler = () => {};
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
});

// Options
useEffect(fn, { sync: true }); // Synchronous (discouraged)
useEffect(fn, { sync: "init" }); // Async but run immediately once
useEffect(fn, { suspense: false }); // Don't pause during Suspense
```

### `useMemo`

Create derived observable.

```ts
function useMemo<T>(
  fn: () => T,
  options?: MemoOptions<T>
): ObservableReadonly<T>;
```

```tsx
const doubled = useMemo(() => count() * 2);
```

### `useCleanup`

Register cleanup when computation disposes.

```ts
function useCleanup(fn: () => void): void;
```

### `useDisposed`

Returns observable that becomes true when disposed.

```ts
function useDisposed(): ObservableReadonly<boolean>;
```

### `useBoolean`

Reactive `!!` operator.

```ts
function useBoolean(value: FunctionMaybe<unknown>): FunctionMaybe<boolean>;
```

### `useReadonly`

Create readonly observable from writable.

```ts
function useReadonly<T>(observable: Observable<T>): ObservableReadonly<T>;
```

### `useResolved`

Unwrap potentially wrapped values with optional callback.

```tsx
useResolved($(123)); // 123
useResolved(() => 123); // 123
useResolved($(123), (value) => value * 2); // 246
useResolved([$(1), $(2)], (a, b) => a + b); // 3
```

### `useResource`

Solid-style resource with mutate/refetch. Handles async, errors, and Suspense.

```ts
function useResource<T, R = unknown>(
  fetcher: ResourceFetcher<unknown, T, R>,
  options?: ResourceOptions<T, unknown>
): [Resource<T>, ResourceActions<T | undefined, R>];

function useResource<T, S, R = unknown>(
  source: ResourceSource<S>,
  fetcher: ResourceFetcher<S, T, R>,
  options?: ResourceOptions<T, S>
): [Resource<T>, ResourceActions<T | undefined, R>];
```

```tsx
const [resource, { mutate, refetch }] = useResource(() =>
  fetch("/api").then((r) => r.json())
);

// Reading (triggers Suspense/ErrorBoundary)
resource().pending; // boolean
resource().error; // Error | undefined
resource().value; // T | undefined
resource().latest; // T | undefined (keeps previous value while pending)

// Helper methods (memoized)
resource.pending();
resource.error();
resource.value();
resource.latest();

// Manual control
mutate((prev) => prev ?? []);
refetch();
```

Note: `mutate(undefined)` clears the resource and returns it to an idle state.
Note: when using a source, the fetcher runs on every source change; if the
source can be empty, handle that case in the fetcher.

### `usePromise`

Wrap promise in resource. Uses `useResource` internally.

```ts
function usePromise<T>(
  promise: FunctionMaybe<Promise<T>>
): [Resource<T>, ResourceActions<T | undefined, unknown>];
```

### `useRoot`

Create detached computation root.

```ts
function useRoot<T>(fn: (dispose: () => void) => T): T;
```

### `useSelector`

Optimized selection pattern.

```ts
function useSelector<T>(
  source: () => T
): (value: T) => ObservableReadonly<boolean>;
```

```tsx
const isSelected = useSelector(() => selectedId());
// In list item:
const selected = isSelected(item.id);
```

### `useSuspended`

Check if nearest Suspense boundary is suspended.

```ts
function useSuspended(): ObservableReadonly<boolean>;
```

### `useUntracked`

Get untracked accessor to value.

```ts
function useUntracked<T>(fn: () => T): () => T;
```

---

## Hooks (Web)

Auto-cleanup alternatives to browser APIs.

### `useEventListener`

```ts
function useEventListener(
  target: FunctionMaybe<EventTarget>,
  event: FunctionMaybe<string>,
  handler: ObservableMaybe<EventHandler>,
  options?: FunctionMaybe<AddEventListenerOptions | true>
): Disposer;
```

### `useTimeout` / `useInterval`

```ts
function useTimeout(
  fn: ObservableMaybe<Callback>,
  ms?: FunctionMaybe<number>
): Disposer;
function useInterval(
  fn: ObservableMaybe<Callback>,
  ms?: FunctionMaybe<number>
): Disposer;
```

### `useAnimationFrame` / `useAnimationLoop`

```ts
function useAnimationFrame(fn: ObservableMaybe<FrameRequestCallback>): Disposer;
function useAnimationLoop(fn: ObservableMaybe<FrameRequestCallback>): Disposer;
```

### `useIdleCallback` / `useIdleLoop`

```ts
function useIdleCallback(
  fn: ObservableMaybe<IdleRequestCallback>,
  options?: FunctionMaybe<IdleRequestOptions>
): Disposer;
function useIdleLoop(
  fn: ObservableMaybe<IdleRequestCallback>,
  options?: FunctionMaybe<IdleRequestOptions>
): Disposer;
```

### `useMicrotask`

Queue microtask with proper context preservation.

```ts
function useMicrotask(fn: () => void): void;
```

### `useAbortController` / `useAbortSignal`

Auto-abort on dispose.

```ts
function useAbortController(signals?: ArrayMaybe<AbortSignal>): AbortController;
function useAbortSignal(signals?: ArrayMaybe<AbortSignal>): AbortSignal;
```

### `useFetch`

Fetch with auto-abort and resource wrapping.

```ts
function useFetch(
  request: FunctionMaybe<RequestInfo>,
  init?: FunctionMaybe<RequestInit>
): [Resource<Response>, ResourceActions<Response | undefined, unknown>];
```

---

## Types

### Observable Types

```ts
type Observable<T> = {
  (): T;
  (value: T): T;
  (fn: (value: T) => T): T;
};

type ObservableReadonly<T> = {
  (): T;
};

type ObservableMaybe<T> = Observable<T> | ObservableReadonly<T> | T;
type ObservableLike<T> = { (): T; (value: T): T; (fn: (v: T) => T): T };
type ObservableReadonlyLike<T> = { (): T };
type FunctionMaybe<T> = (() => T) | T;
```

### Options Types

```ts
type ObservableOptions<T> = {
  equals?: ((value: T, valuePrev: T) => boolean) | false;
};

type MemoOptions<T> = {
  equals?: ((value: T, valuePrev: T) => boolean) | false;
  sync?: boolean;
};

type EffectOptions = {
  suspense?: boolean;
  sync?: boolean | "init";
};

type StoreOptions = {
  unwrap?: boolean;
};
```

### Resource Type

```ts
type ResourceStatic<T> =
  | { pending: true; error?: never; value?: T; latest?: T }
  | { pending: false; error: Error; value?: never; latest?: never }
  | { pending: false; error?: never; value: T; latest: T }
  | { pending: false; error?: never; value?: T; latest?: T };

type Resource<T> = ObservableReadonly<ResourceStatic<T>> & {
  pending(): boolean;
  error(): Error | undefined;
  value(): T | undefined;
  latest(): T | undefined;
};

type ResourceActions<T, R = unknown> = {
  mutate: (value: T | undefined | ((prev: T | undefined) => T | undefined)) => T | undefined;
  refetch: (info?: R | boolean) => void;
};
```
