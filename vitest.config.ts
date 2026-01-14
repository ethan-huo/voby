import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const root = process.cwd()

export default defineConfig({
	esbuild: {
		jsx: 'automatic',
		jsxImportSource: 'voby',
	},
	resolve: {
		alias: {
			'voby/jsx-runtime': resolve(root, 'src/jsx/runtime.ts'),
			'voby/jsx-dev-runtime': resolve(root, 'src/jsx/runtime.ts'),
			voby: resolve(root, 'src/index.ts'),
		},
	},
	test: {
		environment: 'happy-dom',
		include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
	},
})
