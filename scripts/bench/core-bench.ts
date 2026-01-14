import { Window } from 'happy-dom'
import { performance } from 'node:perf_hooks'

const window = new Window()

globalThis.window = window as any
globalThis.document = window.document
globalThis.HTMLElement = window.HTMLElement as any
globalThis.SVGElement = window.SVGElement as any
globalThis.Node = window.Node as any

const CDATASectionImpl =
	(window as any).CDATASection ?? function CDATASection() {}
;(CDATASectionImpl as any).toString = () =>
	'function CDATASection() { [native code] }'

globalThis.CDATASection = CDATASectionImpl as any

const { $, batch, useEffect, useMemo } = await import('../../src/index')

const ITERATIONS = 200_000
const WARMUP = 50_000
const RUNS = 8

const runBatchBench = () => {
	const value = $(0)
	let runs = 0
	const dispose = useEffect(
		() => {
			value()
			runs += 1
		},
		{ sync: 'init' },
	)

	for (let i = 0; i < WARMUP; i += 1) {
		batch(() => {
			value(i)
			value(i + 1)
		})
	}

	const start = performance.now()
	for (let i = 0; i < ITERATIONS; i += 1) {
		batch(() => {
			value(i)
			value(i + 1)
		})
	}
	const end = performance.now()

	dispose()

	const durationMs = end - start
	const ops = ITERATIONS / (durationMs / 1000)

	return { durationMs, ops, runs }
}

const runMemoBench = () => {
	const base = $(1)
	const level1 = useMemo(() => base() + 1)
	const level2 = useMemo(() => level1() + 1)
	const level3 = useMemo(() => level2() + 1)

	for (let i = 0; i < WARMUP; i += 1) {
		base(i)
		level3()
	}

	const start = performance.now()
	for (let i = 0; i < ITERATIONS; i += 1) {
		base(i)
		level3()
	}
	const end = performance.now()

	const durationMs = end - start
	const ops = ITERATIONS / (durationMs / 1000)

	return { durationMs, ops }
}

const summary = (values: number[]) => {
	const sorted = [...values].sort((a, b) => a - b)
	const sum = values.reduce((acc, value) => acc + value, 0)
	const avg = sum / values.length
	const p50 = sorted[Math.floor(sorted.length * 0.5)]
	const p95 = sorted[Math.floor(sorted.length * 0.95)]
	const min = sorted[0]
	const max = sorted[sorted.length - 1]
	return { avg, p50, p95, min, max }
}

const batchRuns = [] as ReturnType<typeof runBatchBench>[]
const memoRuns = [] as ReturnType<typeof runMemoBench>[]

for (let i = 0; i < RUNS; i += 1) {
	batchRuns.push(runBatchBench())
	memoRuns.push(runMemoBench())
}

const batchOps = batchRuns.map((run) => run.ops)
const batchMs = batchRuns.map((run) => run.durationMs)
const memoOps = memoRuns.map((run) => run.ops)
const memoMs = memoRuns.map((run) => run.durationMs)

const batchOpsSummary = summary(batchOps)
const batchMsSummary = summary(batchMs)
const memoOpsSummary = summary(memoOps)
const memoMsSummary = summary(memoMs)

console.log('core bench: batch/update')
console.log(`  runs: ${RUNS} warmup: ${WARMUP} iterations: ${ITERATIONS}`)
console.log(
	`  ops/sec avg ${batchOpsSummary.avg.toFixed(0)} p50 ${batchOpsSummary.p50.toFixed(
		0,
	)} p95 ${batchOpsSummary.p95.toFixed(0)} min ${batchOpsSummary.min.toFixed(
		0,
	)} max ${batchOpsSummary.max.toFixed(0)}`,
)
console.log(
	`  duration ms avg ${batchMsSummary.avg.toFixed(2)} p50 ${batchMsSummary.p50.toFixed(
		2,
	)} p95 ${batchMsSummary.p95.toFixed(2)} min ${batchMsSummary.min.toFixed(
		2,
	)} max ${batchMsSummary.max.toFixed(2)}`,
)
console.log(`  effect runs (last): ${batchRuns[batchRuns.length - 1].runs}`)

console.log('core bench: memo/chain')
console.log(
	`  ops/sec avg ${memoOpsSummary.avg.toFixed(0)} p50 ${memoOpsSummary.p50.toFixed(
		0,
	)} p95 ${memoOpsSummary.p95.toFixed(0)} min ${memoOpsSummary.min.toFixed(
		0,
	)} max ${memoOpsSummary.max.toFixed(0)}`,
)
console.log(
	`  duration ms avg ${memoMsSummary.avg.toFixed(2)} p50 ${memoMsSummary.p50.toFixed(
		2,
	)} p95 ${memoMsSummary.p95.toFixed(2)} min ${memoMsSummary.min.toFixed(
		2,
	)} max ${memoMsSummary.max.toFixed(2)}`,
)
