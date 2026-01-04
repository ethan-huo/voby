/* IMPORT */

import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'

import { useBoolean } from '../hooks/use-boolean'
import { useRenderEffect } from '../hooks/use-render-effect'
import { get } from '../methods/get'
import { render } from '../methods/render'
import { createHTMLNode } from '../utils/creators'
import { assign } from '../utils/lang'

/* MAIN */

export const Portal = ({
	when = true,
	mount,
	wrapper,
	children,
}: {
	mount?: Child
	when?: FunctionMaybe<boolean>
	wrapper?: Child
	children: Child
}): ChildWithMetadata<{ portal: HTMLElement }> => {
	const portal = get(wrapper) || createHTMLNode('div')

	if (!(portal instanceof HTMLElement)) throw new Error('Invalid wrapper node')

	const condition = useBoolean(when)

	useRenderEffect(() => {
		if (!get(condition)) return

		const parent = get(mount) || document.body

		if (!(parent instanceof Element)) throw new Error('Invalid mount node')

		parent.insertBefore(portal, null)

		return (): void => {
			parent.removeChild(portal)
		}
	})

	useRenderEffect(() => {
		if (!get(condition)) return

		return render(children, portal)
	})

	return assign(() => get(condition) || children, { metadata: { portal } })
}
