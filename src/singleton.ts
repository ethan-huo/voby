/* IMPORT */

import { isServer } from './methods/is-server'

/* GLOBALS */

declare global {
	var VOBY: boolean | undefined
}

/* MAIN */

const initSingleton = (): void => {
	if (isServer()) return

	const isLoaded = !!globalThis.VOBY

	if (isLoaded) {
		throw new Error('Voby has already been loaded')
	}

	globalThis.VOBY = true
}

/* EXPORT */

export { initSingleton }
