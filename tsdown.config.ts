import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'jsx-runtime': 'src/jsx/runtime.ts',
		router: 'src/router/index.ts',
		'build/vite': 'src/build/vite.ts',
	},
	format: 'esm',
	dts: {
		sourcemap: true, // generates .d.ts.map files
	},
	clean: true,
	external: ['voby/jsx-runtime', 'voby', 'vite'],
	outputOptions: {
		entryFileNames: '[name].js',
		chunkFileNames: '[name].js',
	},
})
