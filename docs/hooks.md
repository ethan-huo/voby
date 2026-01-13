# Hooks (Example-Driven)

Below is a single small Todo demo that uses most hooks. Each block shows a real use case with inline comments.

## Setup

```tsx
import {
  $,
  useEffect,
  useMemo,
  useCleanup,
  useReadonly,
  useUntracked,
  useRoot,
  useResolved,
  useSelector,
  useResource,
  useSuspended,
  useDisposed,
  useEventListener,
  useAbortController,
  useAbortSignal,
  useFetch,
  usePromise,
  useInterval,
  useTimeout,
  useMicrotask,
  useAnimationFrame,
  useAnimationLoop,
  useIdleCallback,
  useIdleLoop,
  useBoolean,
} from 'voby';
```

## Core hooks in context

```tsx
const TodoApp = () => {
  const items = $(['buy milk', 'write docs']);
  const filter = $('all');

  // useMemo: derived data with automatic tracking
  const visible = useMemo(() => {
    const mode = filter();
    const list = items();
    if (mode === 'all') return list;
    if (mode === 'active') return list.filter(Boolean);
    return list;
  });

  // useEffect: reacts when dependencies change
  useEffect(() => {
    console.log('visible count', visible().length);
  });

  // useCleanup: cleanup when computation disposes
  useEffect(() => {
    const id = window.setInterval(() => {}, 1000);
    useCleanup(() => window.clearInterval(id));
  });

  // useReadonly: pass readonly view to children
  const readonlyItems = useReadonly(items);

  // useUntracked: read without tracking
  const readOnce = useUntracked(() => items().length);

  // useRoot: create isolated reactive scope
  const boot = useRoot((dispose) => {
    const temp = $(1);
    useEffect(() => console.log(temp()));
    return () => dispose();
  });
  boot();

  // useResolved: normalize values/observables/tuples
  const size = useResolved([readonlyItems, filter], (list, mode) => {
    return mode === 'all' ? list.length : list.length;
  });

  // useSelector: optimized per-item selection
  const selectedId = $(0);
  const isSelected = useSelector(() => selectedId());

  // useBoolean: convenience observable
  const showAll = useBoolean(true);

  return (
    <div>
      <button onClick={() => showAll((v) => !v)}>Toggle</button>
      <ul>
        {visible().map((text, index) => (
          <li class={() => (isSelected(index)() ? 'active' : '')}>{text}</li>
        ))}
      </ul>
      <div>Total: {size}</div>
      <div>Read once: {readOnce()}</div>
    </div>
  );
};
```

## Async hooks (resource + Suspense)

```tsx
const TodoRemote = () => {
  const [todos, { mutate, refetch }] = useResource(() =>
    fetch('/api/todos').then((r) => r.json())
  );

  // optimistic update without fetching
  const addLocal = (text) => {
    mutate((prev) => (prev ? prev.concat(text) : [text]));
  };

  return (
    <section>
      <button onClick={() => refetch()}>Refresh</button>
      <button onClick={() => addLocal('learn voby')}>Add</button>
      <ul>
        {todos().value?.map((t) => (
          <li>{t}</li>
        ))}
      </ul>
    </section>
  );
};
```

## Web hooks in context

```tsx
const BrowserHooks = () => {
  const count = $(0);

  // useEventListener: auto-cleanup
  useEventListener(window, 'click', () => count((v) => v + 1));

  // useAbortController / useAbortSignal
  const controller = useAbortController();
  const signal = useAbortSignal(controller.signal);

  // useFetch: resource with auto-abort
  const [resp] = useFetch('/api/todos', { signal });

  // usePromise: wrap a promise as resource
  const [value] = usePromise(Promise.resolve(123));

  // useInterval / useTimeout
  useInterval(() => count((v) => v + 1), 1000);
  useTimeout(() => console.log('once'), 2000);

  // useMicrotask
  useMicrotask(() => console.log('microtask'));

  // useAnimationFrame / useAnimationLoop
  useAnimationFrame(() => console.log('raf'));
  useAnimationLoop(() => {});

  // useIdleCallback / useIdleLoop
  useIdleCallback(() => console.log('idle'));
  useIdleLoop(() => {});

  // useDisposed: read disposed flag (useful for async)
  const disposed = useDisposed();

  useEffect(() => {
    if (disposed()) return;
    console.log(resp().pending, value().value);
  });

  return <div>Clicks: {count}</div>;
};
```

## Notes

- For exact signatures and edge cases, see `api-reference.md`.
- For resource behavior details, see `resource.md`.
