/* IMPORT */

import type { Disposer, FunctionMaybe, ObservableMaybe } from '../types'

import { useScheduler } from '../hooks/use-scheduler'
import { get } from '../methods/get'

/* MAIN */

export const useIdleCallback = (
	callback: ObservableMaybe<IdleRequestCallback>,
	options?: FunctionMaybe<IdleRequestOptions>,
): Disposer => {
	return useScheduler({
		callback,
		once: true,
		cancel: cancelIdleCallback,
		schedule: (callback) => requestIdleCallback(callback, get(options)),
	})
}
