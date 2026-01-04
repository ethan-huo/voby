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

export const useInterval = (
	callback: ObservableMaybe<Callback>,
	ms?: FunctionMaybe<number>,
): Disposer => {
	return useScheduler({
		callback,
		cancel: clearInterval,
		schedule: (callback) => setInterval(callback, get(ms)),
	})
}
