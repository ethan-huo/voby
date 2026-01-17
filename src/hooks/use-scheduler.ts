/* IMPORT */

import type { Disposer, FN, FunctionMaybe, ObservableMaybe } from '../types'

import { useEffect } from '../hooks/use-effect'
import { useSuspended } from '../hooks/use-suspended'
import { get } from '../methods/get'
import { untrack } from '../methods/untrack'

/* MAIN */

export const useScheduler = <T, U>({
	loop,
	once,
	callback,
	cancel,
	schedule,
}: {
	loop?: FunctionMaybe<boolean>
	once?: boolean
	callback: ObservableMaybe<FN<[U]>>
	cancel: FN<[T]>
	schedule: (callback: FN<[U]>) => T
}): Disposer => {
	let executed = false
	let suspended = useSuspended()
	let tickId: T

	const work = (value: U): void => {
		executed = true

		if (get(loop)) tick()

		get(callback, false)(value)
	}

	const tick = (): void => {
		tickId = untrack(() => schedule(work))
	}

	const dispose = (): void => {
		untrack(() => cancel(tickId))
	}

	useEffect(
		() => {
			if (once && executed) return

			if (suspended()) return

			tick()

			return dispose
		},
		{ suspense: false },
	)

	return dispose
}
