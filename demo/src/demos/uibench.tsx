/* IMPORT */

import type { JSX } from 'voby'

import { $, store, tick, For, useEffect } from 'voby'

/* TYPES */

type AnimItem = {
	id: number
	time: number
}

type AnimState = {
	items: AnimItem[]
}

type TableItem = {
	id: number
	active: boolean
	props: string[]
}

type TableState = {
	items: TableItem[]
}

type TreeItem = {
	id: number
	container: boolean
	children: TreeItem[]
}

type TreeState = {
	root: TreeItem
}

type State = {
	location: 'anim' | 'table' | 'tree' | 'unknown'
	anim: AnimState
	table: TableState
	tree: TreeState
}

type Results = Record<string, number[]>

/* STATE */

const state = store<State>({
	location: 'unknown',
	anim: {
		items: [],
	},
	table: {
		items: [],
	},
	tree: {
		root: {
			id: 0,
			container: true,
			children: [],
		},
	},
})

/* MAIN */

const Anim = ({ state }: { state: AnimState }): JSX.Element => {
	return (
		<div class="Anim">
			<For values={state.items} unkeyed>
				{(item) => {
					const id = () => item().id
					const borderRadius = () => item().time % 10
					const background = () =>
						`rgba(0,0,0,${0.5 + (item().time % 10) / 10})`
					return (
						<div
							class="AnimBox"
							data-id={id}
							style={{ borderRadius, background }}
						/>
					)
				}}
			</For>
		</div>
	)
}

const Table = ({ state }: { state: TableState }): JSX.Element => {
	const onClick = (event: MouseEvent): void => {
		console.log('Clicked' + event.target?.textContent)
		event.stopPropagation()
	}

	return (
		<table class="Table">
			<tbody>
				<For values={state.items} unkeyed>
					{(item) => {
						const id = () => item().id
						const className = () =>
							item().active ? 'TableRow active' : 'TableRow'
						const content = () => `#${item().id}`
						return (
							<tr class={className} data-id={id}>
								<td class="TableCell">{content}</td>
								<For values={() => item().props} unkeyed>
									{(text) => (
										<td class="TableCell" onClick={onClick}>
											{text}
										</td>
									)}
								</For>
							</tr>
						)
					}}
				</For>
			</tbody>
		</table>
	)
}

const TreeNode = ({ item }: { item: () => TreeItem }): JSX.Element => {
	return (
		<ul class="TreeNode">
			<For values={() => item().children} unkeyed>
				{(item) => () =>
					item().container ? <TreeNode item={item} /> : <TreeLeaf item={item} />
				}
			</For>
		</ul>
	)
}

const TreeLeaf = ({ item }: { item: () => TreeItem }): JSX.Element => {
	return <li class="TreeLeaf">{() => item().id}</li>
}

const Tree = ({ state }: { state: TreeState }): JSX.Element => {
	return (
		<div class="Tree">
			<TreeNode item={() => state.root} />
		</div>
	)
}

const App = ({ state }: { state: State }): JSX.Element => {
	return (
		<div class="Main">
			{() => {
				const location = state.location
				if (location === 'anim') return <Anim state={state.anim} />
				if (location === 'table') return <Table state={state.table} />
				if (location === 'tree') return <Tree state={state.tree} />
				return null
			}}
		</div>
	)
}

const Results = ({ results }: { results: Results }): JSX.Element => {
	const elapsed = Object.values(results)
		.flat()
		.reduce((acc, elapsed) => acc + elapsed, 0)

	console.log(elapsed)

	return <pre>{JSON.stringify(results, undefined, 2)}</pre>
}

/* MAIN */

const results$ = $(null as Results | null)
let started = false

const UIBench = (): JSX.Element => {
	useEffect(() => {
		if (started || !globalThis.uibench) return
		started = true

		const normalize = (value) => ({
			// Removing major custom classes, which won't be reconciled properly
			location: value.location,
			anim: {
				items: value.anim.items,
			},
			table: {
				items: value.table.items,
			},
			tree: {
				root: value.tree.root,
			},
		})

		const onUpdate = (stateNext) => {
			store.reconcile(state, normalize(stateNext))
			tick()
		}

		const onFinish = (results) => {
			results$(results)
		}

		globalThis.uibench.init('Voby', '*')
		globalThis.uibench.run(onUpdate, onFinish)
	})

	return () => {
		const results = results$()
		return results ? <Results results={results} /> : <App state={state} />
	}
}

export default UIBench
