import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs', 
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    postcss({
      extensions: ['.css', '.scss'],
      extract: true,
      minimize: true,
      use: [['sass', { includePaths: ['./src/Styles'] }]],
    }),
    svgr(),
    url({
      include: [
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.gif',
        '**/*.svg',
        '**/*.webp',
        '**/*.mp4',
        '**/*.webm'
      ],
      limit: 0,
    }),
  ],
};