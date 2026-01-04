import { render } from 'voby'
import { Router, Routes, Route, A } from 'voby/router'

import Benchmark from './demos/benchmark'
import Boxes from './demos/boxes'
import Clock from './demos/clock'
import Counter from './demos/counter'
import Creation from './demos/creation'
import EmojiCounter from './demos/emoji_counter'
import HMR from './demos/hmr'
import HTML from './demos/html'
import Hyperscript from './demos/hyperscript'
import Spiral from './demos/spiral'
import StoreCounter from './demos/store_counter'
import Triangle from './demos/triangle'
import UIBench from './demos/uibench'

const demos = [
	{ path: '/benchmark', name: 'Benchmark', component: Benchmark },
	{ path: '/boxes', name: 'Boxes', component: Boxes },
	{ path: '/clock', name: 'Clock', component: Clock },
	{ path: '/counter', name: 'Counter', component: Counter },
	{ path: '/creation', name: 'Creation', component: Creation },
	{ path: '/emoji_counter', name: 'Emoji Counter', component: EmojiCounter },
	{ path: '/hmr', name: 'HMR', component: HMR },
	{ path: '/html', name: 'HTML', component: HTML },
	{ path: '/hyperscript', name: 'Hyperscript', component: Hyperscript },

	{ path: '/spiral', name: 'Spiral', component: Spiral },
	{ path: '/store_counter', name: 'Store Counter', component: StoreCounter },
	{ path: '/triangle', name: 'Triangle', component: Triangle },
	{ path: '/uibench', name: 'UIBench', component: UIBench },
	{
		path: '/error',
		name: 'Error (throws)',
		component: () => {
			throw new Error('Intentional demo error')
		},
	},
]

const Home = () => (
	<div>
		<h1>Voby Demos</h1>
		<ul>
			{demos.map((demo) => (
				<li>
					<A href={demo.path}>{demo.name}</A>
				</li>
			))}
		</ul>
	</div>
)

const App = () => {
	return (
		<Router>
			<nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
				<A href="/">Home</A>
				{demos.map((demo) => (
					<A href={demo.path} style={{ marginLeft: '1rem' }}>
						{demo.name}
					</A>
				))}
			</nav>
			<main style={{ padding: '1rem' }}>
				<Routes>
					<Route path="/" element={<Home />} />
					{demos.map((demo) => (
						<Route path={demo.path} element={<demo.component />} />
					))}
				</Routes>
			</main>
		</Router>
	)
}

render(<App />, document.getElementById('app')!)
