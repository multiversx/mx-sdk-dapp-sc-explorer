# AGENTS.md

Guidance for AI coding agents working in this repository. Human contributors should
read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) and [`README.md`](README.md) —
this file covers what an agent needs that those two do not spell out.

## Project

`@multiversx/sdk-dapp-sc-explorer` is a React component library that renders a Smart
Contract Explorer UI for the MultiversX blockchain. It is consumed by host apps
(e.g. MultiversX Explorer, MultiversX Utils) — **there is no standalone app, dev
server, or test runner in this repo**. You cannot "run the app" here; verification is
lint + build + type-check, and, when a change needs real-browser proof, linking the
built package into a consumer app with yalc.

## Setup

Package manager: **pnpm**, Node **≥ 24**. A `pnpm-lock.yaml` is committed — never
introduce `package-lock.json` or `yarn.lock`, and never run `npm install`.

```bash
pnpm install --frozen-lockfile
```

`pnpm-workspace.yaml` pins `allowBuilds` (postinstall scripts are opt-in) and excludes
`@multiversx/*` from `minimumReleaseAge`, so freshly published SDK alphas resolve.

## Commands

| Command                     | What it does                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm lint`                 | ESLint 9 flat config (`eslint.config.mjs`) over `src`                                  |
| `pnpm lint:fix`             | Same, with autofix                                                                     |
| `pnpm compile`              | `tsc -p tsconfig.build.json` + `tsc-alias` — declarations only, this is the type-check |
| `pnpm build-esbuild`        | Clean `out/` and run `esbuild.js` (per-module ESM + CJS), no types                     |
| `pnpm build`                | `build-esbuild` then `compile` — the full publishable output                           |
| `pnpm publish-package`      | `build` + `npm publish`                                                                |
| `pnpm publish-package-next` | `build` + `npm publish --tag next` (beta)                                              |
| `pnpm publish-yalc`         | `build` + `yalc publish --push --sig` for local consumer testing                       |

The `scripts` block uses `npm run` internally for cross-tool compatibility; invoke the
scripts themselves with `pnpm`.

## Verification before you claim a change works

There is no test runner. `package.json#files` excludes `*.test.*` / `*.playwright.*`
patterns, but no test tooling is wired up — do not report "tests pass", and do not add
a test framework unless explicitly asked.

Run, in this order, and paste real output rather than asserting success:

1. `pnpm lint`
2. `pnpm compile` — catches type errors; the esbuild step does **not** type-check
3. `pnpm build` — if you touched `esbuild.js`, styles, imports, or path aliases

For build changes, also inspect the artefacts: `out/` must contain interleaved
`.mjs` / `.cjs` / `.d.ts` trees, a single `out/styles.css`, and **no** `out/__chunks__`
directory. Confirm internal imports in an emitted file are relative and
extension-stamped (e.g. `from './styles.module.mjs'`), never bare (`from 'components'`).

For UI/behaviour changes that need real-browser proof, `pnpm publish-yalc` and pull the
package into a consumer app. Say so explicitly if you did not do this.

## Build pipeline

`esbuild.js` emits **one output file per source module** — no bundling, no code
splitting, no shared chunks. Each target is built into a temp dir, run through
`tsc-alias`, then copied into `out/`:

- ESM → `out-esm` (`.mjs`, `tsconfig.esm.json`, `tsconfig.alias-esm.json`)
- CJS → `out-cjs` (`.cjs`, `tsconfig.cjs.json`, `tsconfig.alias-cjs.json`)

Each target runs **two esbuild passes**:

1. **Styles** — entry points are `src/**/*.scss` minus `_*.scss` sass partials (pulled
   in via `@use` by `globals.module.scss`). Uses **`esbuild-style-plugin`** with
   `extract: true`, which compiles sass, runs `postcss-modules`
   (`generateScopedName: 'mx-sdk-sc-[local]'`, `localsConvention: 'dashes'`), writes the
   CSS to a real `styles.module.css`, and emits a JS module exporting **only the
   class-name map**. This pass needs `bundle: true` (the plugin resolves extracted CSS
   through a virtual module), which is safe: stylesheets have no cross-imports, so with
   `splitting: false` no shared chunk can be produced.
2. **Scripts** — entry points are `src/**/*.{ts,tsx}` minus `*.d.ts` and tests/mocks,
   with `bundle: false`.

After both passes, `writeStylesheet()` concatenates every emitted `.css` into
**`out/styles.css`** — the single file consumers import. Scoped names are unhashed and
unique across files, so concatenation order is not significant; globals are placed first
regardless.

Nothing injects CSS at runtime and no JS module touches `document` at import time — that
is what makes the library SSR-safe. (`esbuild-sass-plugin`'s `postcssModules` emits an
unguarded `document.head.appendChild(...)` in every version with no option to change it,
which is why it is not used.)

One local plugin remains: `stripStyleExtensionPlugin` — with `bundle: false` esbuild
leaves import specifiers untouched, so `'…/styles.module.scss'` is rewritten to
`'…/styles.module'`, which resolves to the class-name map from pass 1. `tsc-alias` then
relativizes it and stamps `.mjs`/`.cjs`, exactly like every other internal import.

Path aliases are the load-bearing detail: source uses `baseUrl`-relative bare imports
(`from 'components'`, `from 'lib'`). `replaceTscAliasPaths({ resolveFullPaths: true,
resolveFullExtension })` runs over each esbuild output tree to rewrite them to relative,
extension-stamped specifiers. No `paths` map is needed — `tsc-alias`'s base-url replacer
keys off `baseUrl` alone.

`package.json` points `main` → `./out/index.cjs`, `module` → `./out/index.mjs`,
`types` → `./out/index.d.ts`; there is deliberately **no `exports` map** (a wildcard map
cannot serve directory imports like `/out/types`) and **no `sideEffects: false`**.
Consumers deep-import `@multiversx/sdk-dapp-sc-explorer/out/...`.

History — this previously used esbuild with `bundle: true` + `splitting: true`, which
produced `out/__chunks__/*.mjs` that Vite could not re-bundle (`init_chunk_* is not
defined` at runtime), forcing `optimizeDeps` workarounds in consumers. The per-module
shape matches what `@multiversx/sdk-dapp` and `@multiversx/sdk-dapp-swap` ship and cut
the ESM payload from ≈1.17 MB to ≈200 KB. Polyfilling node builtins is the consumer
bundler's job — the old `node-stdlib-browser` shim was a library anti-pattern and is
gone, along with `esbuild-node-externals` (inert without bundling) and
`esbuild-plugin-svgr` (the single SVG is now a hand-written component,
`src/assets/img/MultiversXSymbol.tsx`).

TypeScript: `tsconfig.base.json` sets `emitDeclarationOnly: true`, `strict: true`,
`jsx: "react"`, and crucially **`baseUrl: "./src"`**. `tsconfig.build.json` is the
declaration build (excludes tests/mocks); `tsconfig.alias-esm.json` /
`tsconfig.alias-cjs.json` exist only to point `tsc-alias` at the esbuild output trees.

## Architecture

### Single public entry point

`src/index.tsx` exports `ScExplorerContainer` and the `SCExplorerType` config type —
that's the entire public API. Everything else is internal. `ScExplorerContainer` wraps
children in `AppContextProvider` and, if no children are passed, renders the default
`<Layout />`.

### Context stack (nested, order matters)

`src/contexts/AppContextProvider.tsx` composes providers in this order — inner providers
depend on outer ones:

```
CustomClassNames → Icons → Network → Config → SmartContract
  → Account → Support → UserActions → SCExplorer
```

`SCExplorerContextProvider` aggregates values from every provider above it into one
context read via **`useSCExplorerContext()`**. Components almost always consume this
single hook rather than individual contexts.

Stateful contexts (`SmartContractContext`, `UserActionsContext`, `ConfigContext`) are
folded directories with `index.tsx` / `reducer.tsx` / `state.tsx` / `types.ts` and use
`useReducer` with a typed enum-discriminated action union.

### `src/lib/` — SDK re-export boundary

All imports from `@multiversx/sdk-core`, `@multiversx/sdk-dapp`, `@multiversx/sdk-dapp-ui`,
`@multiversx/sdk-dapp-form`, `@multiversx/sdk-dapp-utils` are funneled through
`src/lib/**` and re-exported. Application code imports `from 'lib'` (or
`from 'lib/sdkCore'`) — **never reach into `@multiversx/*` packages directly from
components/hooks/helpers**. This is how the library controls its SDK surface; changing
an SDK version means editing `src/lib/sdkDapp/*.ts` etc., not chasing imports across the
codebase.

Re-exports use the SDK's `out/...` deep paths (e.g.
`@multiversx/sdk-dapp/out/managers/TransactionManager`) — these are stable subpath
exports from the SDK.

### Styling

Every styled component uses the `withStyles` HOC (`src/hocs/withStyles.tsx`), which
injects a `styles` prop (the component's own CSS-module locals) and a `globalStyles` prop
(`assets/styles/globals.module.scss`, imported by the HOC itself). A `.scss` import
resolves to a **class-name map only** — the CSS itself ships separately in
`out/styles.css` — so these imports are pure data and safe on the server.

Class names are composed with `classnames` and pulled from three sources: component-local
`styles`, `globalStyles`, and user-supplied `customClassNames` (via context). Preserve
this chain when editing `className` props.

### Data flow for the main UX

1. Host passes a `verifiedContract` (from the MultiversX `/verification` API) and/or an
   `abi` into `SmartContractContext`.
2. `SmartContractContext` parses it with `getAbiRegistry` (from `helpers/`) into an
   `AbiRegistry` — the parsed ABI is the source of truth for endpoints/types/events
   rendered in the Layout tabs.
3. Read operations use `hooks/useQueryContract.ts` + `hooks/provider/` (API or proxy,
   selected by `networkConfig.provider`).
4. Write operations build transactions via SDK helpers and flow through
   `helpers/sendAndTrackTransactions.ts` (uses `getAccountProvider().signTransactions()`
   - `TransactionManager`).

### Layout

`components/Layout/Layout.tsx` is the default renderer: a Tabs container
(`react-bootstrap`) with `LayoutSidebar` (tab list) + `LayoutPanels` (tab contents). Tabs
are gated by `support` flags derived from `config` (`canView`, `canMutate`, `canLoadAbi`,
`canDeploy`, `canUpgrade`, `canDisplayContractDetails`) and by whether an ABI / contract
address is present. `activeSection` can be controlled externally via props for
host-driven routing.

## Conventions

- **Imports**: bare specifiers rooted at `src/` (`from 'components'`, `from 'contexts'`,
  `from 'lib'`). ESLint's `import/order` sorts alphabetically with `react` pinned first
  in the external group.
- **SDK access**: always via `src/lib/`. Never add a direct `@multiversx/*` import
  outside of `src/lib/`.
- **Quotes / semis**: single quotes, required semicolons, LF line endings (ESLint).
- **React**: `jsx: "react"` (classic runtime), React ≥ 18 peer dep. Components are
  typically memoized (`memo(...)`) then wrapped with `withStyles`.
- **Optional peers**: FontAwesome packages and `classnames` are `optionalDependencies` —
  treat icon props as possibly-undefined and default them at the call site (see
  `LoginButton.tsx`).
- **Constants**: magic numbers and strings live in `src/constants/`, not inline.

## Workflows

### Add a styled component

1. Create `src/components/Foo/Foo.tsx` and `src/components/Foo/styles.module.scss`.
2. Import the stylesheet as `componentStyles` — **not** `styles`, since components
   destructure `styles` from props:

   ```tsx
   import componentStyles from 'components/Foo/styles.module.scss';

   export const Foo = withStyles(FooComponent, { styles: componentStyles });
   ```

   The options bag is optional: `withStyles(FooComponent)` gives `globalStyles` only.

3. Re-export from `src/components/index.ts` so callers can `import { Foo } from 'components'`.
4. `pnpm lint && pnpm compile`. The new `.scss` is picked up automatically by the style
   pass — no esbuild config change needed.

### Add global state

Add a provider under `src/contexts/`, insert it in `AppContextProvider.tsx` at the right
depth (inner providers may read outer ones), then surface its value on
`SCExplorerContext` so components can reach it through `useSCExplorerContext()`. For
stateful contexts, follow the folded `index.tsx` / `reducer.tsx` / `state.tsx` /
`types.ts` shape with an enum-discriminated action union.

### Bump an SDK dependency

1. Update the version in `package.json` — in **all** relevant blocks
   (`dependencies` / `peerDependencies` / `devDependencies`; the `@multiversx/*` SDKs are
   peers-plus-dev so they appear twice).
2. `pnpm install` and commit the updated `pnpm-lock.yaml`.
3. Fix any breakage **inside `src/lib/`** — that is the only place SDK symbols are
   imported. If a symbol moved, change the re-export path there; application code should
   not need edits.
4. `pnpm compile` to surface type breakage, then `pnpm build`.

### Change the build

`esbuild.js` is the whole pipeline; read the Build pipeline section above before editing
it. The invariants a change must preserve: one output file per module, no
`out/__chunks__`, a single concatenated `out/styles.css`, no runtime `document` access at
import time, and internal specifiers rewritten to relative + extension-stamped by
`tsc-alias`. Verify with `pnpm build` and inspect `out/`.

### Ship a change

1. `pnpm lint && pnpm compile && pnpm build`.
2. Add a CHANGELOG.md entry — a CI job (`.github/workflows/changelog.yml`,
   `dangoslen/changelog-enforcer`) **fails the PR without one**. Entries are hand-written
   with the PR link, newest section on top, matching the existing format.
3. Bump `version` in `package.json` manually if the change should be released. A
   prerelease version (e.g. `0.0.8-alpha.0`) publishes to the `next` npm tag; a plain
   version publishes to `latest`.
4. Branch per `.github/CONTRIBUTING.md`: features target `development`, bugfixes target
   `main`. Open a PR — never push straight to `main`.

Publishing is automated: `.github/workflows/sdk-dapp-sc-explorer-publish.yml` runs on
push to `main` (also `workflow_dispatch` / `repository_dispatch`), installs with
`--frozen-lockfile`, runs `pnpm build`, and publishes to npm with the tag chosen from
whether the version is a prerelease. Do not run `pnpm publish-package` locally unless
explicitly asked.

## Guardrails

- Do not commit or push unless asked; never push to `main` directly.
- Do not add a test framework, dev server, or bundler config on your own initiative.
- Do not add direct `@multiversx/*` imports outside `src/lib/`.
- Do not edit anything in `out/`, `out-esm/`, `out-cjs/`, or `.yalc/` — all generated.
- Do not hand-edit `pnpm-lock.yaml`; regenerate it with `pnpm install`.
- Never claim "tests pass" — there are none. Report exactly which of lint / compile /
  build you ran.
