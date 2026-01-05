import { render, lazy, Suspense } from 'voby'
import { Router, Routes, Route, A } from 'voby/router'

const Benchmark = lazy(() => import('./demos/benchmark'))
const Boxes = lazy(() => import('./demos/boxes'))
const Clock = lazy(() => import('./demos/clock'))
const Counter = lazy(() => import('./demos/counter'))
const Creation = lazy(() => import('./demos/creation'))
const EmojiCounter = lazy(() => import('./demos/emoji_counter'))
const HMR = lazy(() => import('./demos/hmr'))
const HTML = lazy(() => import('./demos/html'))
const Hyperscript = lazy(() => import('./demos/hyperscript'))
const Spiral = lazy(() => import('./demos/spiral'))
const StoreCounter = lazy(() => import('./demos/store_counter'))
const Triangle = lazy(() => import('./demos/triangle'))

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
				<Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route path="/" element={<Home />} />
						{demos.map((demo) => (
							<Route path={demo.path} element={<demo.component />} />
						))}
					</Routes>
				</Suspense>
			</main>
		</Router>
	)
}

render(<App />, document.getElementById('app')!)
