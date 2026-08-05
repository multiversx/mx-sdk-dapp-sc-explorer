const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const glob = require('glob');
const stylePlugin = require('esbuild-style-plugin');
const { replaceTscAliasPaths } = require('tsc-alias');

const basedir = 'src';

// exclude tests and mocks
const excludeFromBuild =
  /(\/__mocks__\/|\/__tests__\/|\.test\.|\.spec\.|\.jest\.|\.playwright\.|\.puppeteer\.|-mock\.|\.d\.ts$)/;

// `_*.scss` are sass partials consumed via @use by globals.module.scss,
const isSassPartial = (file) => path.basename(file).startsWith('_');

const scriptFiles = glob
  .sync('./src/**/*.{ts,tsx}')
  .filter((file) => !excludeFromBuild.test(file));

const styleFiles = glob
  .sync('./src/**/*.scss')
  .filter((file) => !excludeFromBuild.test(file) && !isSassPartial(file));

const stripStyleExtensionPlugin = {
  name: 'strip-style-extension',
  setup(build) {
    build.onLoad({ filter: /\.tsx?$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      const contents = source.replace(
        /(['"])([^'"\n]+)\.module\.scss\1/g,
        '$1$2.module$1'
      );

      if (contents === source) {
        return null;
      }

      return {
        contents,
        loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts'
      };
    });
  }
};

// Scripts: one output file per source module, no bundling, no code splitting.
const scriptConfig = {
  entryPoints: scriptFiles,
  platform: 'node',
  bundle: false,
  outbase: basedir,
  minify: true,
  sourcemap: true,
  target: ['es2021'],
  plugins: [stripStyleExtensionPlugin]
};

const styleConfig = {
  entryPoints: styleFiles,
  outbase: basedir,
  bundle: true,
  splitting: false,
  minify: true,
  target: ['es2021'],
  plugins: [
    stylePlugin({
      extract: true,
      cssModulesMatch: /\.module\./,
      cssModulesOptions: {
        scopeBehaviour: 'local',
        localsConvention: 'dashes',
        generateScopedName: 'mx-sdk-sc-[local]'
      },
      renderOptions: {
        sassOptions: {
          loadPaths: [`./${basedir}`, 'node_modules'],
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'abs-percent',
            'color-functions'
          ]
        }
      }
    })
  ]
};

const targets = [
  {
    label: 'ESM',
    format: 'esm',
    outdir: 'out-esm',
    extension: '.mjs',
    tsconfig: './tsconfig.esm.json',
    aliasConfig: './tsconfig.alias-esm.json'
  },
  {
    label: 'CJS',
    format: 'cjs',
    outdir: 'out-cjs',
    extension: '.cjs',
    tsconfig: './tsconfig.cjs.json',
    aliasConfig: './tsconfig.alias-cjs.json'
  }
];

function writeStylesheet() {
  const files = glob.sync('out/**/*.css').sort((fileA, fileB) => {
    const isGlobal = (file) => (file.includes('globals.module') ? 0 : 1);
    return isGlobal(fileA) - isGlobal(fileB) || fileA.localeCompare(fileB);
  });

  const stylesheet = files
    .map((file) => fs.readFileSync(file, 'utf8').trim())
    .filter(Boolean)
    .join('\n\n');

  fs.writeFileSync('out/styles.css', `${stylesheet}\n`);

  return { count: files.length, bytes: Buffer.byteLength(stylesheet) };
}

async function build() {
  try {
    fs.rmSync('out', { recursive: true, force: true });

    for (const target of targets) {
      fs.rmSync(target.outdir, { recursive: true, force: true });

      await esbuild.build({
        ...styleConfig,
        format: target.format,
        outdir: target.outdir,
        outExtension: { '.js': target.extension }
      });

      await esbuild.build({
        ...scriptConfig,
        format: target.format,
        outdir: target.outdir,
        outExtension: { '.js': target.extension },
        tsconfig: target.tsconfig
      });

      await replaceTscAliasPaths({
        configFile: target.aliasConfig,
        resolveFullPaths: true,
        resolveFullExtension: target.extension
      });

      fs.cpSync(target.outdir, 'out', { recursive: true });
      fs.rmSync(target.outdir, { recursive: true, force: true });

      console.log(
        `[sdk-dapp-sc-explorer][Build] ✅ ${target.label} build completed`
      );
    }

    const { count, bytes } = writeStylesheet();
    console.log(
      `[sdk-dapp-sc-explorer][Build] ✅ out/styles.css written (${count} stylesheets, ${bytes} bytes)`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
