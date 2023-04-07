import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import progress from 'rollup-plugin-progress'
export default {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
      // tsconfigOverride: {
      //   compilerOptions: {
      //     declaration: true,
      //   },
      // },
      clean: true,
    }),
    terser(),
    progress({
      format: '[:bar] :percent (:current/:total)',
    }),
  ],
  output: [
    // {
    //   file: 'dist/i18nExtractCli.umd.js',
    //   format: 'umd',
    //   name: 'i18nExtractCli',
    // },
    // {
    //   file: 'dist/i18nExtractCli.esm.js',
    //   format: 'es',
    //   name: 'i18nExtractCli',
    // },
    {
      file: 'dist/i18nExtractCli.common.js',
      format: 'cjs',
      name: 'i18nExtractCli',
    },
  ],
}
