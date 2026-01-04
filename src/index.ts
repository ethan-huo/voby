/* IMPORT */

import type {
	EffectOptions,
	FunctionMaybe,
	MemoOptions,
	Observable,
	ObservableLike,
	ObservableReadonly,
	ObservableReadonlyLike,
	ObservableMaybe,
	ObservableOptions,
	Resource,
	StoreOptions,
} from './types'

import { initSingleton } from './singleton'

initSingleton()

/* EXPORT */

export * from './components'
export * from './jsx/runtime'
export * from './hooks'
export * from './methods'
export type {
	EffectOptions,
	FunctionMaybe,
	MemoOptions,
	Observable,
	ObservableLike,
	ObservableReadonly,
	ObservableReadonlyLike,
	ObservableMaybe,
	ObservableOptions,
	Resource,
	StoreOptions,
}
