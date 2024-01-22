# sdk-dapp-sc-explorer

> A library to hold the main logic for Smart Contract Interactions on the MultiversX blockchain

[![NPM](https://img.shields.io/npm/v/@multiversx/sdk-dapp-sc-explorer.svg)](https://www.npmjs.com/package/@multiversx/sdk-dapp-sc-explorer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![sdk-dapp-sc-explorer](https://github.com/multiversx/mx-sdk-dapp-sc-explorer/blob/main/preview.jpg)

# Installation

The library can be installed via `npm` or `yarn`.

```bash
npm install @multiversx/sdk-dapp-sc-explorer
```

or

```bash
yarn add @multiversx/sdk-dapp-sc-explorer
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

- import the Container:

```typescript
import { ScExplorerContainer } from '@multiversx/sdk-dapp-sc-explorer/containers/ScExplorerContainer';
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
    canDisplayContractDetails: true
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
- `loginParams` - `optional` - custom login actions based on sdk-dapps OnProviderLoginType

`customClassNames` - `optional` - an object that provides existing css classes for an easier styling configuration

`icons` - `optional` - an object that provides FontawesomeIcons used on different components

</details>

## Roadmap

See the [open issues](https://github.com/multiversx/mx-sdk-dapp-sc-explorer/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open-source community such an amazing place to be, learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

GPL-3.0-or-later
