/* IMPORT */

import type { Child, Component, FunctionMaybe } from '../types'

import { useMemo } from '../hooks/use-memo'
import { createElement } from '../methods/create-element'
import { get } from '../methods/get'
import { resolve } from '../methods/resolve'
import { isFunction } from '../utils/lang'

/* MAIN */

export const Dynamic = <P = {}>({
	component,
	props,
	children,
}: {
	component: Component<P>
	props?: FunctionMaybe<P | null>
	children?: Child
}): Child => {
	if (isFunction(component) || isFunction(props)) {
		return useMemo(() => {
			return resolve(
				createElement<P>(get(component, false), get(props), children),
			)
		})
	} else {
		return createElement<P>(component, props, children)
	}
}
