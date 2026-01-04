/* IMPORT */

import type {
	Child,
	LazyFetcher,
	LazyResult,
	ObservableReadonly,
} from '../types'

import { useMemo } from '../hooks/use-memo'
import { useResolved } from '../hooks/use-resolved'
import { useResource } from '../hooks/use-resource'
import { createElement } from '../methods/create-element'
import { resolve } from '../methods/resolve'
import { once } from '../utils/lang'

/* MAIN */

export const lazy = <P = {}>(fetcher: LazyFetcher<P>): LazyResult<P> => {
	const fetcherOnce = once(fetcher)

	const component = (props: P): ObservableReadonly<Child> => {
		const resource = useResource(fetcherOnce)

		return useMemo(() => {
			return useResolved(resource, ({ pending, error, value }) => {
				if (pending) return

				if (error) throw error

				const component = 'default' in value ? value.default : value

				return resolve(createElement<P>(component, props))
			})
		})
	}

	component.preload = (): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			const resource = useResource(fetcherOnce)

			useResolved(resource, ({ pending, error }) => {
				if (pending) return

				if (error) return reject(error)

				return resolve()
			})
		})
	}

	return component
}
