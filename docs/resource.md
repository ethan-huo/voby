# useResource

`useResource` is a Solid-style resource with explicit `mutate`/`refetch` controls and Suspense integration.

## Signatures

```ts
const [resource, actions] = useResource(fetcher, options)
const [resource, actions] = useResource(source, fetcher, options)
```

- `source` is reactive. When it is `null`, `undefined`, or `false`, the resource becomes idle and does not fetch.
- `fetcher` receives a non-null `sourceValue` plus `info` (previous value + `refetching` flag).

## Resource shape

`resource()` returns a state object with:

- `pending: boolean`
- `error?: Error`
- `value?: T`
- `latest?: T`

Accessing `resource().value` or `resource().latest` while pending can trigger `Suspense`.

## Actions

```ts
const { mutate, refetch } = actions
```

- `mutate(next)` updates value immediately without running the fetcher.
- `refetch(info?)` re-runs the fetcher without changing the source. `info` is exposed as `refetching`.
- `mutate(undefined)` clears the resource and returns it to idle.

## Behavior notes

- Last request wins: older async results are ignored after a newer fetch starts.
- `latest` keeps the previous value during pending states.
- If `initialValue` is provided, the resource starts resolved.

## Example

```tsx
const [todos, { mutate, refetch }] = useResource(getTodos)

mutate(prev => (prev ? prev.concat(newTodo) : [newTodo]))
refetch()
```

```tsx
const [todos] = useResource(
  () => user() ?? null,
  (u) => fetchTodos(u.id),
)
```
