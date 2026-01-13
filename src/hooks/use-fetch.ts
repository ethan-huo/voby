/* IMPORT */

import type { FunctionMaybe, ResourceReturn } from '../types'

import { useAbortSignal } from '../hooks/use-abort-signal'
import { useResolved } from '../hooks/use-resolved'
import { useResource } from '../hooks/use-resource'

/* MAIN */

export const useFetch = (
	request: FunctionMaybe<RequestInfo>,
	init?: FunctionMaybe<RequestInit>,
): ResourceReturn<Response, unknown> => {
	return useResource(() => {
		return useResolved([request, init], (request, init = {}) => {
			const signal = useAbortSignal(init.signal || [])

			init.signal = signal

			return fetch(request, init)
		})
	})
}
