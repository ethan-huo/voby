/* IMPORT */

import type { JSX } from '../jsx/types'
import type { Child, Component, Props, Ref } from '../types'

import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'
import { createElement } from '../methods/create-element'
import { mergePropsN, mergeRefs } from '../methods/merge-props'
import { untrack } from '../methods/untrack'
import { wrapElement } from '../methods/wrap-element'
import { isArray, isFunction, isNil, isNode, isString } from '../utils/lang'
import { setProps } from '../utils/setters'

/* MAIN */

type RenderCallback<State> = (props: Props, state: State) => Child
type IntrinsicTag = keyof JSX.IntrinsicElements
type RenderProp<State> = RenderCallback<State> | IntrinsicTag | Node

type RenderElementComponentProps<State> = Props & { render?: RenderProp<State> }

type RenderElementParameters<State> = {
	enabled?: boolean
	props?: Props | Props[] | ((props: Props) => Props)
	ref?: Ref | Ref[]
	state?: State
}

export const renderElement = <State = {}>(
	component: Component,
	componentProps: RenderElementComponentProps<State> = {},
	params: RenderElementParameters<State> = {},
): Child => {
	const { render, ...externalProps } = componentProps
	const { enabled = true, props, ref, state = {} as State } = params

	if (enabled === false) return null

	const propList: Props[] = []

	if (!isNil(props)) {
		if (isArray(props)) {
			propList.push(...props)
		} else {
			propList.push(props)
		}
	}

	propList.push(externalProps)

	const mergedProps = mergePropsN(propList)
	const outProps = isNil(ref)
		? mergedProps
		: { ...mergedProps, ref: mergeRefs(mergedProps.ref, ref) }

	if (!isNil(render)) {
		if (isFunction(render)) {
			if (SYMBOL_UNTRACKED_UNWRAPPED in (render as object)) {
				throw new Error(
					'Invalid render prop: pass a render function, not a Voby element',
				)
			}

			return wrapElement(() => untrack(() => render(outProps, state)))
		} else if (isString(render)) {
			return createElement(render, outProps)
		} else if (isNode(render)) {
			if (render instanceof HTMLElement) {
				setProps(render, outProps)
			}

			return render
		}
	}

	return createElement(component, outProps)
}
