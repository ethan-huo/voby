/* IMPORT */

import type { Props, Ref } from '../types'

import {
	castArray,
	flatten,
	isFunction,
	isFunctionReactive,
	isString,
} from '../utils/lang'

/* MAIN */

type AnyProps = Props
type PropsGetter<P extends AnyProps> = (props: P) => P
type InputProps<P extends AnyProps = AnyProps> = P | PropsGetter<P> | undefined
type VobyEvent = {
	vobyHandlerPrevented?: boolean
	preventVobyHandler?: () => void
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type ResolveInput<P> =
	P extends PropsGetter<infer R> ? R : P extends undefined ? {} : P

type MergeResult<T extends readonly unknown[]> = Simplify<
	UnionToIntersection<ResolveInput<T[number]>>
>

const EMPTY_PROPS: Props = {}

function mergeProps<T extends readonly unknown[]>(...props: T): MergeResult<T>
function mergeProps(
	a?: InputProps,
	b?: InputProps,
	c?: InputProps,
	d?: InputProps,
	e?: InputProps,
): Props
function mergeProps(
	a?: InputProps,
	b?: InputProps,
	c?: InputProps,
	d?: InputProps,
	e?: InputProps,
): Props {
	let merged = { ...resolvePropsGetter(a, EMPTY_PROPS) }

	if (b) merged = mergeOne(merged, b)
	if (c) merged = mergeOne(merged, c)
	if (d) merged = mergeOne(merged, d)
	if (e) merged = mergeOne(merged, e)

	return merged
}

function mergePropsN<T extends readonly unknown[]>(props: T): MergeResult<T>
function mergePropsN(props: ReadonlyArray<InputProps>): Props
function mergePropsN(props: ReadonlyArray<InputProps>): Props {
	if (props.length === 0) return EMPTY_PROPS
	if (props.length === 1) return resolvePropsGetter(props[0], EMPTY_PROPS)

	let merged = { ...resolvePropsGetter(props[0], EMPTY_PROPS) }

	for (let i = 1, l = props.length; i < l; i++) {
		merged = mergeOne(merged, props[i])
	}

	return merged
}

const mergeOne = (merged: Props, inputProps: InputProps): Props => {
	if (isPropsGetter(inputProps)) return inputProps(merged)

	return mutablyMergeInto(merged, inputProps)
}

const mutablyMergeInto = (
	mergedProps: Props,
	externalProps: Props | undefined,
): Props => {
	if (!externalProps) return mergedProps

	for (const propName in externalProps) {
		const externalPropValue = externalProps[propName]
		const key = propName === 'className' ? 'class' : propName

		switch (key) {
			case 'style': {
				mergedProps.style = mergeStyles(mergedProps.style, externalPropValue)
				break
			}
			case 'class': {
				mergedProps.class = mergeClasses(mergedProps.class, externalPropValue)
				break
			}
			case 'ref': {
				mergedProps.ref = mergeRefs(mergedProps.ref, externalPropValue)
				break
			}
			default: {
				if (isEventHandler(key, externalPropValue)) {
					mergedProps[key] = mergeEventHandlers(
						mergedProps[key],
						externalPropValue,
					)
				} else if (key !== 'className') {
					mergedProps[key] = externalPropValue
				}
			}
		}
	}

	return mergedProps
}

const isEventHandler = (key: string, value: unknown): boolean => {
	const code0 = key.charCodeAt(0)
	const code1 = key.charCodeAt(1)

	return (
		code0 === 111 &&
		code1 === 110 &&
		(typeof value === 'function' || typeof value === 'undefined')
	)
}

const isPropsGetter = (
	inputProps: InputProps,
): inputProps is (props: Props) => Props => {
	return isFunction(inputProps) && !isFunctionReactive(inputProps)
}

const resolvePropsGetter = (
	inputProps: InputProps,
	previousProps: Props,
): Props => {
	return isPropsGetter(inputProps)
		? inputProps(previousProps)
		: (inputProps ?? previousProps)
}

const mergeEventHandlers = (
	ourHandler: Function | undefined,
	theirHandler: Function | undefined,
): Function | undefined => {
	if (!theirHandler) return ourHandler
	if (!ourHandler) return theirHandler

	return (event: unknown) => {
		makeEventPreventable(event)

		const result = theirHandler(event)

		const vobyEvent = getVobyEvent(event)

		if (!vobyEvent?.vobyHandlerPrevented) {
			ourHandler?.(event)
		}

		return result
	}
}

const makeEventPreventable = (event: unknown): void => {
	const vobyEvent = getVobyEvent(event)

	if (!vobyEvent) return
	if (typeof vobyEvent.preventVobyHandler === 'function') return

	vobyEvent.preventVobyHandler = () => {
		vobyEvent.vobyHandlerPrevented = true
	}
}

const getVobyEvent = (event: unknown): VobyEvent | null => {
	if (!event || typeof event !== 'object') return null

	return event as VobyEvent
}

const mergeClasses = (ourClass: unknown, theirClass: unknown): unknown => {
	if (theirClass == null) return ourClass
	if (ourClass == null) return theirClass

	return [theirClass, ourClass]
}

const mergeStyles = (ourStyle: unknown, theirStyle: unknown): unknown => {
	if (theirStyle == null) return ourStyle
	if (ourStyle == null) return theirStyle

	if (isString(ourStyle) || isString(theirStyle)) return theirStyle

	return [ourStyle, theirStyle]
}

const mergeRefs = <T>(
	ourRef: null | undefined | Ref<T> | (null | undefined | Ref<T>)[],
	theirRef: null | undefined | Ref<T> | (null | undefined | Ref<T>)[],
): null | undefined | Ref<T> | Ref<T>[] => {
	const normalizedOur = normalizeRefs(ourRef)
	const normalizedTheir = normalizeRefs(theirRef)

	if (normalizedOur == null) return normalizedTheir ?? null
	if (normalizedTheir == null) return normalizedOur ?? null

	return flatten(
		castArray(normalizedOur).concat(castArray(normalizedTheir)),
	).filter(isRef) as Ref<T>[]
}

const normalizeRefs = <T>(
	value: null | undefined | Ref<T> | (null | undefined | Ref<T>)[],
): null | undefined | Ref<T> | Ref<T>[] => {
	if (value == null) return null

	if (Array.isArray(value)) {
		const refs = flatten(castArray(value)).filter(isRef) as Ref<T>[]

		return refs.length ? refs : null
	}

	return value
}

const isRef = <T>(value: unknown): value is Ref<T> => {
	return isFunction(value)
}

/* EXPORT */

export { mergeProps, mergePropsN, mergeRefs }
