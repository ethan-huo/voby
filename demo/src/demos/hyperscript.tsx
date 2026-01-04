/* IMPORT */

import type { JSX } from 'voby'

import { $, h } from 'voby'

/* MAIN */

const Counter = (): JSX.Element => {
	const value = $(0)

	const increment = () => value((prev) => prev + 1)
	const decrement = () => value((prev) => prev - 1)

	return [
		h('h1', 'Counter'),
		h('p', value),
		h('button', { onClick: increment }, '+'),
		h('button', { onClick: decrement }, '-'),
	]
}

export default Counter
