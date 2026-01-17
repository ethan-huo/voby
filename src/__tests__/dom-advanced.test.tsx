import { describe, expect, it } from 'vitest'

import { $, For, Suspense, createElement, render, usePromise } from '../index'

const mount = () => {
	const root = document.createElement('div')
	document.body.appendChild(root)
	return root
}

const flushDom = () =>
	new Promise<void>((resolve) =>
		queueMicrotask(() => queueMicrotask(() => resolve())),
	)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('dom advanced', () => {
	it('diffs keyed list updates', async () => {
		const root = mount()
		const values = $([
			{ id: 'a', value: 'A' },
			{ id: 'b', value: 'B' },
			{ id: 'c', value: 'C' },
		])

		render(
			<ul>
				<For values={values}>
					{(item) => <li data-id={item.id}>{item.value}</li>}
				</For>
			</ul>,
			root,
		)

		const before = Array.from(root.querySelectorAll('li')).map(
			(node) => (node as HTMLElement).dataset.id,
		)
		expect(before).toEqual(['a', 'b', 'c'])

		values([
			{ id: 'c', value: 'C' },
			{ id: 'a', value: 'A' },
			{ id: 'b', value: 'B' },
		])
		await flushDom()

		const after = Array.from(root.querySelectorAll('li')).map(
			(node) => (node as HTMLElement).dataset.id,
		)
		expect(after).toEqual(['c', 'a', 'b'])
	})

	it('diffs unkeyed list updates', async () => {
		const root = mount()
		const values = $([1, 2, 3])

		render(
			<ul>
				<For values={values} unkeyed>
					{(value) => <li>{value}</li>}
				</For>
			</ul>,
			root,
		)

		expect(root.querySelectorAll('li').length).toBe(3)

		values([4, 5])
		await flushDom()

		expect(root.querySelectorAll('li').length).toBe(2)
		expect(root.textContent).toBe('45')
	})

	it('renders suspense fallback then resolves', async () => {
		const root = mount()
		const pending = $(true)

		const App = () => {
			const [resource] = usePromise(
				() =>
					new Promise<string>((resolve) => {
						setTimeout(() => resolve('done'), 5)
					}),
			)

			return (
				<Suspense when={pending} fallback={<span>loading</span>}>
					<span>{() => resource().value ?? ''}</span>
				</Suspense>
			)
		}

		render(<App />, root)

		await flushDom()
		expect(root.textContent).toBe('loading')

		await sleep(10)
		pending(false)
		await flushDom()
		expect(root.textContent).toBe('done')
	})

	it('cleans up events after dispose', async () => {
		const root = mount()
		const count = $(0)

		const disposer = render(
			<button onClick={() => count(count() + 1)}>{count}</button>,
			root,
		)

		const button = root.querySelector('button') as HTMLButtonElement | null
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		await flushDom()
		expect(button?.textContent).toBe('1')

		disposer()
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		await flushDom()
		expect(count()).toBe(1)
	})

	it('can render via createElement with props', async () => {
		const root = mount()
		const value = $(1)
		const node = createElement('span', { id: 'ce', children: value })

		render(node, root)
		expect(root.textContent).toBe('1')

		value(2)
		await flushDom()
		expect(root.textContent).toBe('2')
	})
})
