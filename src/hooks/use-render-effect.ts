/* IMPORT */

import type { Disposer, EffectFunction, EffectOptions } from '../types'

import { useEffect } from '../hooks/use-effect'

/* HELPERS */

const options: EffectOptions = {
	sync: 'init',
}

/* MAIN */

// This function exists for convenience, and to avoid creating unnecessary options objects

export const useRenderEffect = (fn: EffectFunction): Disposer => {
	return useEffect(fn, options)
}
