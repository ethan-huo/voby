/* IMPORT */

import type { FunctionMaybe, Resource } from '../types'

import { useResource } from '../hooks/use-resource'
import { get } from '../methods/get'

/* MAIN */

export const usePromise = <T>(
	promise: FunctionMaybe<Promise<T>>,
): Resource<T> => {
	return useResource(() => get(promise))
}
