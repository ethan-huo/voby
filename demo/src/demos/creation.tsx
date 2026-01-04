/* IMPORT */

import { h, createElement, template, Dynamic, resolve } from 'voby'

/* HELPERS */

const delay = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

/* MAIN */

const testDocumentCreateElement = () => {
	return document.createElement('div')
}

const testCloneNode = (() => {
	const node = document.createElement('div')
	return () => {
		return node.cloneNode(true)
	}
})()

const testH = () => {
	return resolve(h('button'))
}

const testCreateElement = () => {
	return resolve(createElement('button'))
}

const testJSX = () => {
	return resolve(<button />)
}

const testDynamic = () => {
	return resolve(resolve(<Dynamic component="button" />))
}

const testDynamicRaw = () => {
	return resolve(Dynamic({ component: 'button' }))
}

const testTemplate = (() => {
	const PROPS = {}
	const tmpl = template(() => {
		return h('button')
	})
	return () => {
		return resolve(tmpl(PROPS))
	}
})()

const test = async () => {
	const tests: [string, () => unknown][] = [
		['document.createElement', testDocumentCreateElement],
		['cloneNode', testCloneNode],
		['h', testH],
		['createElement', testCreateElement],
		['jsx', testJSX],
		['dynamic', testDynamic],
		['dynamic.raw', testDynamicRaw],
		['template', testTemplate],
	]

	console.time('total')

	for (const [name, fn] of tests) {
		console.time(name)

		for (let i = 0; i < 1_000_000; i++) {
			fn()
		}

		console.timeEnd(name)

		// await delay ( 500 );
	}

	console.timeEnd('total')
}

test()

const Creation = () => {
	return <div>Check console for creation benchmark results</div>
}

export default Creation
