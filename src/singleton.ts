/* IMPORT */

import { isServer } from './methods/is-server'

/* GLOBALS */

declare global {
	var VOBY: boolean | undefined
}

/* MAIN */

if (!isServer()) {
	const isLoaded = !!globalThis.VOBY

	if (isLoaded) {
		throw new Error('Voby has already been loaded')
	} else {
		globalThis.VOBY = true
	}
}
