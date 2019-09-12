import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import cleaner from 'rollup-plugin-cleaner';

const pkg = require('./package.json');

export default {
	input: './src/index.ts',
	output: [
		{file: pkg.main, name: 'DataSchema', format: 'umd', sourcemap: true},
		{file: pkg.module, format: 'es', sourcemap: true},
	],
	external: [],
	watch: {
		include: './src/**',
	},
	plugins: [
		cleaner({targets: ['./dist/']}),
		json(),
		typescript({useTsconfigDeclarationDir: true, objectHashIgnoreUnknownHack: true}),
		commonjs(),
		resolve(),
		sourceMaps(),
	]
};