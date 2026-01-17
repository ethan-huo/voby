/* IMPORT */

import type { Callback } from '../types'

import { useCheapDisposed } from '../hooks/use-cheap-disposed'
import { with as _with } from '../oby'

/* MAIN */

//TODO: Maybe port this to oby
//TODO: Maybe special-case this to use one shared mirotask per microtask

export const useMicrotask = (fn: Callback): void => {
	const disposed = useCheapDisposed()
	const runWithOwner = _with()

	queueMicrotask(() => {
		if (disposed()) return

		runWithOwner(fn)
	})
}
