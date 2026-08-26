# sdk-dapp-sc-explorer

> A library to hold the main logic for Smart Contract Interactions on the MultiversX blockchain

[![NPM](https://img.shields.io/npm/v/@multiversx/sdk-dapp-sc-explorer.svg)](https://www.npmjs.com/package/@multiversx/sdk-dapp-sc-explorer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/multiversx/mx-sdk-dapp-sc-explorer)

![sdk-dapp-sc-explorer](https://github.com/multiversx/mx-sdk-dapp-sc-explorer/blob/main/preview.jpg)

# Installation

The library can be installed via `npm`, `yarn` or `pnpm`.

```bash
npm install @multiversx/sdk-dapp-sc-explorer
```

or

```bash
yarn add @multiversx/sdk-dapp-sc-explorer
```

or

```bash
pnpm install @multiversx/sdk-dapp-sc-explorer
```

# Usage

## ABI - Application Binary Interface

To interact with a Smart Contract it is essential to understand its inputs and outputs. This is valid both for on-chain calls, and for off-chain tools, and can in most cases also tell us a lot about what the smart contract does and how it does it.

For this reason, blockchain smart contracts have so-called ABIs, expressed in a platform-agnostic language - JSON in our case.

Read more about the MultiversX ABI Format here: [https://docs.multiversx.com/developers/data/abi](https://docs.multiversx.com/developers/data/abi)

The ABI interaction functionality is built upon [https://github.com/multiversx/mx-sdk-js-core](https://github.com/multiversx/mx-sdk-js-core).

---

## Interaction

The Smart Contract Explorer BETA offers an easy way to understand the functionality behind a Smart Contract and to interact with it.

The [`@multiversx/sdk-dapp-sc-explorer`](https://www.npmjs.com/package/@multiversx/sdk-dapp-sc-explorer) package is already implemented on the [MultiversX Explorer](https://devnet-explorer.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgq2ddn0gave73udf0rrwaepu2gafzlr56n396q9nqpx7/code/details) where the user can preview and interact with the Verified Smart Contracts and on the [MultiversX Utils](https://utils.multiversx.com/smart-contract?network=devnet) where one can Load the data from an ABI file and interact with an already deployed SC or Deploy/Upgrade a new SC.

### Read SC State

The current state of the deployed SC can be checked without any need to login, the output is already decoded and processed for an easy overview.

### Modify SC State

The Smart Contract State can be changed with a transaction, therefore, in order to change the state the user must login with one of the login providers in order to sign the transaction.

### Load ABI

An ABI file can be loaded in order to have an overview of the structure, check the endpoints, events, types, etc.

### Deploy SC

A .wasm file is required to deploy a new Smart Contract, some SCs can be initialized with a config described in the constructor. In order to initialize with those options one can load the ABI file beforehand.

### Upgrade SC

Similar to a new deployment, the .wasm file is required and also the ABI in order to properly set the initial state ( if needed ).
The address of the currently deployed SC is also required in order to upgrade

---

## Prerequisites

There are a couple of requirements that need to be met for the application to work properly.

**_If you experience bugs, please make sure that you read these, before opening an issue_**

<details>
  <summary>
      React
  </summary>

### React

This library was built for applications that use React, it might not be suitable for usage with other libraries or frameworks.

</details>

<details>
  <summary>
    ScExplorerContainer
 </summary>

### `<ScExplorerContainer />`

The **`<ScExplorerContainer />`** component, which is exported by the library, is needed to create a Context to be able to manipulate the data.

- import the stylesheet once, at the root of your app:

```typescript
import '@multiversx/sdk-dapp-sc-explorer/out/styles.css';
```

Per-component stylesheets are also published (e.g. `@multiversx/sdk-dapp-sc-explorer/out/components/CardItem/styles.module.css`) if you prefer to import only what you render.

- import the Container:

```typescript
import { ScExplorerContainer } from '@multiversx/sdk-dapp-sc-explorer/out/containers/ScExplorerContainer';
```

```jsx
<ScExplorerContainer
  smartContract={{
    verifiedContract: contract,
    deployedContractDetails: account
  }}
  accountConsumerHandlers={{
    useGetLoginInfo,
    useGetAccountInfo
  }}
  networkConfig={{ environment, apiAddress }}
  config={{
    canMutate: true,
    canLoadAbi: true,
    canDeploy: true,
    canUpgrade: true,
    canDisplayContractDetails: true,
    hasGeneralLogin: true,
    hasViewInExplorer: true
  }}
  customClassNames={customClassNames}
  icons={icons}
/>
```

`smartContract`

- `contractAddress` - `optional` - provide the Address where the Contract is already Deployed
- `abi` - `optional` - provide the ABI beforehand
- `verifiedContract` - `optional` - Verified Contract Details that include the ABI, Files, etc - as retrieved from API ([example](https://devnet-api.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgq2ddn0gave73udf0rrwaepu2gafzlr56n396q9nqpx7/verification))

`accountConsumerHandlers`

- `useGetLoginInfo` - an async function that returns the Login state ( can be used from sdk-dapp )
- `useGetAccountInfo` - an async function that returns the Account details ( can be used from sdk-dapp )
  is an async function that returns the accessToken mandatory for authorizing the requests.
- `onLoginClick` - `optional` - in case an external Login action/modal must be triggered on interaction with the `Connect Wallet` buttons

`networkConfig`

- `environment` - devnet | testnet | mainnet
- `apiAddress` - `optional` - use a different API address on calls

`config`

- `canMutate` - allow Smart Contract state changes, the user must be logged in order to sign the transactions
- `canLoadAbi` - show the Load ABI Panel in the Layout
- `canDeploy` - show the Deploy Contract Panel in the Layout
- `canUpgrade` - show the Upgrade Contract Panel in the Layout
- `canDisplayContractDetails` - show the Contract Details Panel in the Layout ( if a valid contract address is used )
- `hasGeneralLogin` - `optional` - always show the `Connect Wallet` button in the Layout header, even when `canMutate` is not set ( ignored if `onLoginClick` is provided )
- `hasViewInExplorer` - `optional` - show the `View in Explorer` link in the Contract Details Panel header
- `loginParams` - `optional` - custom login actions based on sdk-dapps OnProviderLoginType

`customClassNames` - `optional` - an object that provides existing css classes for an easier styling configuration

`icons` - `optional` - an object that provides FontawesomeIcons used on different components

</details>

## Development

This repository is a **library only** — there is no standalone app, dev server, or test runner. Development happens by building the package and linking it into a consumer app.

Requirements: **Node ≥ 24** and **pnpm** (a `pnpm-lock.yaml` is committed).

```bash
pnpm install --frozen-lockfile
```

| Command | Description |
| --- | --- |
| `pnpm lint` / `pnpm lint:fix` | ESLint 9 flat config (`eslint.config.mjs`) |
| `pnpm compile` | Type-check and emit declarations (`tsc` + `tsc-alias`) |
| `pnpm build-esbuild` | Build ESM + CJS output only, no declarations |
| `pnpm build` | Full build into `out/` (esbuild + declarations) |
| `pnpm publish-yalc` | Build and `yalc publish --push` for testing in a consumer app |
| `pnpm publish-package` / `pnpm publish-package-next` | Build and publish to npm (`next` tag for prereleases) |

### Project layout

```
src/
  index.tsx        single public entry point
  containers/      ScExplorerContainer — the exported component
  contexts/        nested provider stack, read via useSCExplorerContext()
  components/      UI, each styled through the withStyles HOC
  hooks/           contract queries and provider selection
  helpers/         ABI parsing, transaction building and tracking
  lib/             the only place @multiversx/* packages are imported
  types/           public and internal types
esbuild.js         per-module ESM + CJS build, emits out/styles.css
```

### Publishing

Publishing is automated by `.github/workflows/sdk-dapp-sc-explorer-publish.yml` on push to `main`: a prerelease `version` in `package.json` (e.g. `0.0.8-alpha.0`) goes out under the `next` npm tag, a plain version under `latest`. The version is bumped by hand, and every PR must add a `CHANGELOG.md` entry — this is enforced by CI.

### Working with AI agents

Repository-wide instructions for coding agents live in [AGENTS.md](AGENTS.md) — architecture, build-pipeline invariants, conventions, common workflows, and guardrails. [CLAUDE.md](CLAUDE.md) simply points there. If you change how the project is built or structured, update `AGENTS.md` in the same PR.

## Roadmap

See the [open issues](https://github.com/multiversx/mx-sdk-dapp-sc-explorer/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open-source community such an amazing place to be, learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guidelines.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Run `pnpm lint && pnpm compile && pnpm build`
5. Add an entry to `CHANGELOG.md` (enforced by CI)
6. Push to the Branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request — features against `development`, bugfixes against `main`

## License

GPL-3.0-or-later
