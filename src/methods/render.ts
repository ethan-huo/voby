/* IMPORT */

import type { Child, Disposer } from '../types'

import { useRoot } from '../hooks/use-root'
import { useUntracked } from '../hooks/use-untracked'
import { setChild } from '../utils/setters'

/* MAIN */

export const render = (child: Child, parent?: Element | null): Disposer => {
	if (!parent || !(parent instanceof HTMLElement))
		throw new Error('Invalid parent node')

	parent.textContent = ''

	return useRoot((dispose) => {
		setChild(parent, useUntracked(child))

		return (): void => {
			dispose()

			parent.textContent = ''
		}
	})
}
