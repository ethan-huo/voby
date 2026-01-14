import { observable, effect } from 'oby'

const gc = () => {
	if (typeof Bun !== 'undefined' && typeof Bun.gc === 'function') {
		Bun.gc()
		return true
	}

	if (typeof globalThis.gc === 'function') {
		globalThis.gc()
		return true
	}

	return false
}

if (!gc()) {
	console.error('oby memory: gc not available (Bun.gc or global.gc)')
	process.exit(1)
}

const SAMPLE = 80_000
const ROUNDS = 10
const THRESHOLD = 0.2
const SLOPE_THRESHOLD = 0.02

const heapUsed = () => process.memoryUsage().heapUsed

const runOnce = () => {
	const observables = new Array(SAMPLE)
	for (let i = 0; i < SAMPLE; i += 1) {
		observables[i] = observable(i)
	}

	const disposers = observables.map((value) =>
		effect(
			() => {
				value()
			},
			{ sync: true },
		),
	)

	for (let i = 0; i < SAMPLE; i += 1) {
		observables[i](i + 1)
	}

	for (const dispose of disposers) dispose()

	observables.length = 0
	disposers.length = 0
}

// Warmup
for (let i = 0; i < 3; i += 1) {
	runOnce()
	gc()
}

const baseline = heapUsed()
const growths: number[] = []

for (let i = 0; i < ROUNDS; i += 1) {
	runOnce()
	gc()

	const after = heapUsed()
	const growth = after - baseline
	growths.push(growth)

	console.log(`oby memory: round ${i + 1} after ${after} growth ${growth}`)
}

const sorted = [...growths].sort((a, b) => a - b)
const avgGrowth =
	growths.reduce((sum, value) => sum + value, 0) / growths.length
const maxGrowth = sorted[sorted.length - 1]
const p95Growth = sorted[Math.floor(sorted.length * 0.95)]
const maxRatio = maxGrowth / baseline

const deltas = growths.slice(1).map((value, index) => value - growths[index])
const deltaSorted = [...deltas].sort((a, b) => a - b)
const p95Delta = deltaSorted[Math.floor(deltaSorted.length * 0.95)] ?? 0
const avgDelta =
	deltas.reduce((sum, value) => sum + value, 0) / (deltas.length || 1)
const slopeRatio = p95Delta / baseline

console.log(`oby memory: baseline ${baseline}`)
console.log(`oby memory: avg growth ${Math.round(avgGrowth)}`)
console.log(`oby memory: p95 growth ${p95Growth}`)
console.log(`oby memory: max growth ${maxGrowth}`)
console.log(`oby memory: max ratio ${maxRatio.toFixed(3)}`)
console.log(`oby memory: avg delta ${Math.round(avgDelta)}`)
console.log(`oby memory: p95 delta ${Math.round(p95Delta)}`)
console.log(`oby memory: slope ratio ${slopeRatio.toFixed(3)}`)

if (maxRatio > THRESHOLD) {
	console.error(
		`oby memory: growth exceeded ${(THRESHOLD * 100).toFixed(0)}% of baseline`,
	)
	process.exit(1)
}

if (slopeRatio > SLOPE_THRESHOLD) {
	console.error(
		`oby memory: slope exceeded ${(SLOPE_THRESHOLD * 100).toFixed(1)}% of baseline`,
	)
	process.exit(1)
}
