/* IMPORT */

import type { Child } from '../types'

import { resolve } from '../methods/resolve'
import { context } from '../oby'
import { isFunction, isNil } from '../utils/lang'

/* MAIN */

function createContext<T extends {}>(
	init?: undefined,
	name?: string,
): [(props: { value: T; children: Child }) => Child, () => T]
function createContext<T extends {}, P>(
	init: (props: P) => T,
	name?: string,
): [(props: P & { children: Child }) => Child, () => T]
function createContext<T extends {}, P = {}>(
	init?: (props: P) => T,
	name?: string,
): [(props: P & { children: Child }) => Child, () => T] {
	const symbol = Symbol()
	const contextName = typeof name === 'string' ? name : undefined

	const ProviderInternal = ({
		value,
		children,
	}: {
		value: T
		children: Child
	}): Child => {
		return context({ [symbol]: value }, () => {
			return resolve(children)
		})
	}

	const Provider = (props: P & { children: Child }): Child => {
		const { children, ...rest } = props || ({} as P & { children: Child })
		const value = isFunction(init)
			? init(rest as P)
			: (props as unknown as { value: T }).value
		if (isNil(value)) {
			throw new Error(
				'Context Provider value must be non-null. Wrap nulls inside your value object instead.',
			)
		}

		return ProviderInternal({ value, children })
	}

	const use = (): T => {
		const valueContext = context(symbol) as T | undefined
		const value = valueContext
		if (isNil(value)) {
			if (contextName) {
				throw new Error(
					`Missing ${contextName}Provider. Wrap your tree with <${contextName}Provider>.`,
				)
			}
			throw new Error(
				'Missing Context Provider. Wrap your tree with the matching <Provider>.',
			)
		}

		return value as T
	}

	return [Provider, use] as const
}

/* EXPORT */

export { createContext }
