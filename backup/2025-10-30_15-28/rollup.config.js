// rollup.config.js
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/dsrt.js",
  output: [
    {
      file: "dist/dsrt.js",
      format: "umd",
      name: "DSRT",
      sourcemap: true,
    },
    {
      file: "dist/dsrt.min.js",
      format: "umd",
      name: "DSRT",
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
    }),
  ],
};
