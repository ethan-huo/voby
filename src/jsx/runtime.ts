/* IMPORT */

import type { Component, Element } from '../types'

import { Fragment } from '../components/fragment'
import { createElement } from '../methods/create-element'
export type { JSX } from './types'

/* MAIN */

const jsx = <P extends {} = {}>(
	component: Component<P>,
	props?: P | null,
	key?: unknown,
): Element => {
	props = key !== undefined ? ({ ...props, key } as any) : props //TSC

	return createElement<P>(component, props)
}

/* EXPORT */

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment }
