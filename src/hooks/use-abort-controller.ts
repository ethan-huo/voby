/* IMPORT */

import type { ArrayMaybe } from '../types'

import { useCleanup } from '../hooks/use-cleanup'
import { useEventListener } from '../hooks/use-event-listener'
import { castArray } from '../utils/lang'

/* MAIN */

export const useAbortController = (
	signals: ArrayMaybe<AbortSignal> = [],
): AbortController => {
	signals = castArray(signals)

	const controller = new AbortController()
	const abort = controller.abort.bind(controller)
	const aborted = signals.some((signal) => signal.aborted)

	if (aborted) {
		abort()
	} else {
		signals.forEach((signal) => useEventListener(signal, 'abort', abort))

		useCleanup(abort)
	}

	return controller
}
