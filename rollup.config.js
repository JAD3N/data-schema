const json = require('rollup-plugin-json');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const pkg = require('./package.json');

module.exports = {
	input: 'src/index.ts',
	output: [
		{file: pkg.main, name: 'DataSchema', format: 'umd', sourcemap: true},
		{file: pkg.module, format: 'es', sourcemap: true}
	],
	external: [],
	watch: {
		include: 'src/**'
	},
	plugins: [
		json(),
		typescript({useTsconfigDeclarationDir: true}),
		commonjs(),
		resolve(),
		sourceMaps()
	]
};
