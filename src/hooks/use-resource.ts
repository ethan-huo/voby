/* IMPORT */

import type {
	ObservableMaybe,
	PromiseMaybe,
	ResourceStaticPending,
	ResourceStaticRejected,
	ResourceStaticResolved,
	ResourceStaticIdle,
	ResourceStatic,
	ResourceFunction,
	Resource,
	ResourceSource,
	ResourceFetcher,
	ResourceOptions,
	ResourceReturn,
	ResourceActions,
} from '../types'

import { SuspenseManager } from '../components/suspense.manager'
import { useCheapDisposed } from '../hooks/use-cheap-disposed'
import { useReadonly } from '../hooks/use-readonly'
import { useRenderEffect } from '../hooks/use-render-effect'
import { get } from '../methods/get'
import { $ } from '../methods/S'
import { untrack } from '../methods/untrack'
import { assign, castError, isFunction, isPromise } from '../utils/lang'

/* MAIN */

//TODO: Maybe port this to oby, as "from"
//TODO: Option for returning the resource as a store, where also the returned value gets wrapped in a store
//FIXME: SSR demo: toggling back and forth between /home and /loader is buggy, /loader gets loaded with no data, which is wrong

type UseResource = {
	<T, S, R = unknown>(
		source: ResourceSource<S>,
		fetcher: ResourceFetcher<S, T, R>,
		options?: ResourceOptions<T, S>,
	): ResourceReturn<T, R>
	<T, R = unknown>(
		fetcher: ResourceFetcher<unknown, T, R>,
		options?: ResourceOptions<T, unknown>,
	): ResourceReturn<T, R>
}

export const useResource = (<T, S, R>(
	pSource: ResourceSource<S> | ResourceFetcher<S, T, R>,
	pFetcher?: ResourceFetcher<S, T, R> | ResourceOptions<T, S>,
	pOptions?: ResourceOptions<T, S>,
): ResourceReturn<T, R> => {
	let source: ResourceSource<S>
	let fetcher: ResourceFetcher<S, T, R>
	let options: ResourceOptions<T, S>

	if (typeof pFetcher === 'function') {
		source = pSource as ResourceSource<S>
		fetcher = pFetcher as ResourceFetcher<S, T, R>
		options = (pOptions || {}) as ResourceOptions<T, S>
	} else {
		source = true as ResourceSource<S>
		fetcher = pSource as ResourceFetcher<S, T, R>
		options = (pFetcher || {}) as ResourceOptions<T, S>
	}

	const pending = $(false)
	const error = $<Error>()
	const value = $<T>()
	const latest = $<T>()
	const hasInitialValue = 'initialValue' in options

	if (hasInitialValue) {
		const initialValue = options.initialValue as T
		value(() => initialValue)
		latest(() => initialValue)
	}

	const { suspend, unsuspend } = new SuspenseManager()
	const resourcePending: ResourceStaticPending<T> = {
		pending: true,
		get value(): T | undefined {
			return value() ?? void suspend()
		},
		get latest(): T | undefined {
			const latestValue = latest()
			if (latestValue !== undefined) return latestValue
			return value() ?? void suspend()
		},
	}
	const resourceRejected: ResourceStaticRejected = {
		pending: false,
		get error(): Error {
			return error()!
		},
		get value(): never {
			throw error()!
		},
		get latest(): never {
			throw error()!
		},
	}
	const resourceResolved: ResourceStaticResolved<T> = {
		pending: false,
		get value(): T {
			return value()!
		},
		get latest(): T {
			return latest() ?? value()!
		},
	}
	const resourceIdle: ResourceStaticIdle<T> = {
		pending: false,
		get value(): T | undefined {
			return value()
		},
		get latest(): T | undefined {
			return latest()
		},
	}
	const resourceFunction: ResourceFunction<T> = {
		pending: () => pending(),
		error: () => error(),
		value: () => resource().value,
		latest: () => resource().latest,
	}
	const resource = $<ResourceStatic<T>>(
		hasInitialValue ? resourceResolved : resourceIdle,
	)

	let disposed = (): boolean => false
	let fetchId = 0

	const setIdle = (): void => {
		pending(false)
		error(undefined)
		resource(value() === undefined ? resourceIdle : resourceResolved)
		unsuspend()
	}

	const setPending = (keepValue: boolean): void => {
		pending(true)
		error(undefined)
		if (!keepValue) value(undefined)
		resource(resourcePending)
	}

	const setResolved = (result: T): void => {
		if (disposed()) return

		pending(false)
		error(undefined)
		value(() => result)
		latest(() => result)
		resource(resourceResolved)
	}

	const setRejected = (exception: unknown): void => {
		if (disposed()) return

		pending(false)
		error(castError(exception))
		value(undefined)
		resource(resourceRejected)
	}

	const finalize = (id: number): void => {
		if (disposed()) return
		if (id !== fetchId) return

		unsuspend()
	}

	const runFetch = (
		refetching: R | boolean = false,
		sourceOverride?: S,
	): void => {
		const lookup = sourceOverride ?? get(source as ObservableMaybe<S>)

		const keepValue = value() !== undefined
		const currentId = (fetchId += 1)

		setPending(keepValue)

		try {
			const result = untrack(() =>
				fetcher(lookup as S, {
					value: value(),
					refetching,
				}),
			)
			const resolved = get(result as ObservableMaybe<PromiseMaybe<T>>)

			if (isPromise(resolved)) {
				resolved
					.then((value) => {
						if (currentId !== fetchId) return
						setResolved(value)
					})
					.catch((error) => {
						if (currentId !== fetchId) return
						setRejected(error)
					})
					.finally(() => finalize(currentId))
			} else {
				setResolved(resolved as T)
				finalize(currentId)
			}
		} catch (error: unknown) {
			setRejected(error)
			finalize(currentId)
		}
	}

	const mutate = (
		next: T | undefined | ((prev: T | undefined) => T | undefined),
	): T | undefined => {
		const prev = value()
		const resolved = isFunction(next)
			? (next as (prev: T | undefined) => T | undefined)(prev)
			: next

		pending(false)
		error(undefined)
		if (resolved === undefined) {
			value(undefined)
			latest(undefined)
			resource(resourceIdle)
		} else {
			value(() => resolved)
			latest(() => resolved)
			resource(resourceResolved)
		}

		return resolved
	}

	const refetch = (info?: R | boolean): void => {
		runFetch(info ?? true)
	}

	const actions: ResourceActions<T | undefined, R> = {
		mutate,
		refetch,
	}

	useRenderEffect(() => {
		disposed = useCheapDisposed()

		const lookup = get(source as ObservableMaybe<S>)

		runFetch(false, lookup)
	})

	return [assign(useReadonly(resource), resourceFunction), actions]
}) as UseResource
