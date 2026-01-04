import path from 'node:path'
import { defineConfig } from 'vite'
import { voby } from 'voby/build/vite'

export default defineConfig({
	plugins: [voby()],
})
