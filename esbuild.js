const svgrPlugin = require('esbuild-plugin-svgr');
const esbuild = require('esbuild');
const glob = require('glob');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');

const basedir = 'src';

const files = glob
  .sync('{./src/**/*.tsx,./src/**/*.ts,./src/**/*.scss}')
  .filter((file) => !file.includes('.test.') && !file.includes('/__mocks__/'));

const commonConfig = {
  entryPoints: files,
  platform: 'node',
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer'
  },
  plugins: [
    svgrPlugin(),
    plugin(stdLibBrowser),
    nodeExternalsPlugin(),
    sassPlugin({
      loadPaths: [`./${basedir}`, 'node_modules'],
      basedir,
      transform: postcssModules({
        basedir,
        scopeBehaviour: 'local',
        localsConvention: 'dashes',
        generateScopedName: 'mx-sdk-sc-[local]'
      }),
      silenceDeprecations: [
        'legacy-js-api',
        'import',
        'global-builtin',
        'abs-percent',
        'color-functions'
      ]
    })
  ]
};

async function build() {
  try {
    // ESM build
    await esbuild.build({
      ...commonConfig,
      splitting: true,
      format: 'esm',
      outdir: 'out',
      bundle: true,
      minify: true,
      sourcemap: true,
      chunkNames: '__chunks__/[name]-[hash]',
      target: ['es2021'],
      outExtension: { '.js': '.mjs' },
      tsconfig: './tsconfig.esm.json'
    });
    console.log('[sdk-dapp-sc-explorer][Build] ✅ ESM build completed');

    // CJS build
    await esbuild.build({
      ...commonConfig,
      format: 'cjs',
      outdir: 'out',
      minify: true,
      sourcemap: true,
      target: ['es2021'],
      outExtension: { '.js': '.cjs' },
      tsconfig: './tsconfig.cjs.json'
    });
    console.log('[sdk-dapp-sc-explorer][Build] ✅ CJS build completed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
