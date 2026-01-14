import { describe, expect, it } from 'vitest'

import { $, For, If, createElement, render } from '../index'

const mount = () => {
	const root = document.createElement('div')
	document.body.appendChild(root)
	return root
}

const flushDom = () =>
	new Promise<void>((resolve) =>
		queueMicrotask(() => queueMicrotask(() => resolve())),
	)

describe('dom rendering', () => {
	it('renders a simple element', () => {
		const root = mount()
		render(<div id="one">hello</div>, root)

		const node = root.querySelector('#one')
		expect(node?.textContent).toBe('hello')
	})

	it('updates text when observable changes', async () => {
		const root = mount()
		const value = $(0)

		render(<p>{value}</p>, root)
		expect(root.textContent).toBe('0')

		value(3)
		await flushDom()
		expect(root.textContent).toBe('3')
	})

	it('updates class and style props', async () => {
		const root = mount()
		const active = $(false)

		render(
			<div
				class={() => ({ active: active(), idle: !active() })}
				style={() => ({ color: active() ? 'red' : 'blue' })}
			/>,
			root,
		)

		const node = root.querySelector('div') as HTMLDivElement | null
		expect(node?.classList.contains('active')).toBe(false)
		expect(node?.style.color).toBe('blue')

		active(true)
		await flushDom()
		expect(node?.classList.contains('active')).toBe(true)
		expect(node?.style.color).toBe('red')
	})

	it('handles If conditional rendering', async () => {
		const root = mount()
		const show = $(true)

		render(
			<If when={show} fallback={<span>no</span>}>
				<span>yes</span>
			</If>,
			root,
		)

		expect(root.textContent).toBe('yes')
		show(false)
		await flushDom()
		expect(root.textContent).toBe('no')
	})

	it('handles For list rendering', async () => {
		const root = mount()
		const values = $([1, 2])

		render(
			<ul>
				<For values={values}>{(value) => <li>{value}</li>}</For>
			</ul>,
			root,
		)

		expect(root.querySelectorAll('li').length).toBe(2)
		values([1, 2, 3])
		await flushDom()
		expect(root.querySelectorAll('li').length).toBe(3)
	})

	it('handles events', async () => {
		const root = mount()
		const count = $(0)

		render(<button onClick={() => count(count() + 1)}>{count}</button>, root)

		const button = root.querySelector('button') as HTMLButtonElement | null
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

		await flushDom()
		expect(button?.textContent).toBe('2')
	})

	it('supports createElement with intrinsic tag', () => {
		const root = mount()
		render(createElement('div', { id: 'created' }), root)

		const node = root.querySelector('#created')
		expect(node).toBeTruthy()
	})
})
