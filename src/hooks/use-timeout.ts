/* IMPORT */

import type {
	Callback,
	Disposer,
	FunctionMaybe,
	ObservableMaybe,
} from '../types'

import { useScheduler } from '../hooks/use-scheduler'
import { get } from '../methods/get'

/* MAIN */

export const useTimeout = (
	callback: ObservableMaybe<Callback>,
	ms?: FunctionMaybe<number>,
): Disposer => {
	return useScheduler({
		callback,
		once: true,
		cancel: clearTimeout,
		schedule: (callback) => setTimeout(callback, get(ms)),
	})
}
