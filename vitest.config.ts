/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		exclude: [...configDefaults.exclude],
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			include: ['src/**'],
			exclude: ['src/index.ts'],
		},
	},
});
