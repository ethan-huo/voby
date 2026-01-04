/* IMPORT */

import type { Disposer, ObservableMaybe } from '../types'

import { useScheduler } from '../hooks/use-scheduler'

/* MAIN */

export const useAnimationFrame = (
	callback: ObservableMaybe<FrameRequestCallback>,
): Disposer => {
	return useScheduler({
		callback,
		once: true,
		cancel: cancelAnimationFrame,
		schedule: requestAnimationFrame,
	})
}
