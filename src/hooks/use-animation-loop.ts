/* IMPORT */

import type { Disposer, ObservableMaybe } from '../types'

import { useScheduler } from '../hooks/use-scheduler'

/* MAIN */

export const useAnimationLoop = (
	callback: ObservableMaybe<FrameRequestCallback>,
): Disposer => {
	return useScheduler({
		callback,
		loop: true,
		cancel: cancelAnimationFrame,
		schedule: requestAnimationFrame,
	})
}
