/* IMPORT */

import type { ArrayMaybe } from '../types'

import { useAbortController } from '../hooks/use-abort-controller'

/* MAIN */

export const useAbortSignal = (
	signals: ArrayMaybe<AbortSignal> = [],
): AbortSignal => {
	return useAbortController(signals).signal
}
