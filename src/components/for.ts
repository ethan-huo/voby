/* IMPORT */

import type {
	Child,
	FunctionMaybe,
	Indexed,
	ObservableReadonly,
} from '../types'

import { for as _for } from '../oby'

/* MAIN */

function For<T>({
	values,
	fallback,
	pooled,
	unkeyed,
	children,
}: {
	values?: FunctionMaybe<readonly T[]>
	fallback?: Child
	pooled?: false
	unkeyed?: false
	children: (value: T, index: FunctionMaybe<number>) => Child
}): ObservableReadonly<Child>
function For<T>({
	values,
	fallback,
	pooled,
	unkeyed,
	children,
}: {
	values?: FunctionMaybe<readonly T[]>
	fallback?: Child
	pooled?: boolean
	unkeyed: true
	children: (value: Indexed<T>, index: FunctionMaybe<number>) => Child
}): ObservableReadonly<Child>
function For<T>({
	values,
	fallback,
	pooled,
	unkeyed,
	children,
}: {
	values?: FunctionMaybe<readonly T[]>
	fallback?: Child
	pooled?: boolean
	unkeyed?: boolean
	children: (value: T | Indexed<T>, index: FunctionMaybe<number>) => Child
}): ObservableReadonly<Child> {
	return _for(values, children, fallback, { pooled, unkeyed } as any) //TSC
}

/* EXPORT */

export { For }
