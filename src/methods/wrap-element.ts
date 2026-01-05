/* IMPORT */

import { SYMBOL_UNTRACKED_UNWRAPPED } from '../constants'

/* MAIN */

export const wrapElement = <T extends Function>(element: T): T => {
	;(element as any)[SYMBOL_UNTRACKED_UNWRAPPED] = true

	return element
}
