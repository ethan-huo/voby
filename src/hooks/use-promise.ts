/* IMPORT */

import type { FunctionMaybe, ResourceReturn } from '../types'

import { useResource } from '../hooks/use-resource'
import { get } from '../methods/get'

/* MAIN */

export const usePromise = <T>(
	promise: FunctionMaybe<Promise<T>>,
): ResourceReturn<T, unknown> => {
	return useResource(() => get(promise))
}
