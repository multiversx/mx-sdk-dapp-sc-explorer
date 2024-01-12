import React from 'react';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';
import {
  ExtensionLoginButtonPropsType,
  LedgerLoginButtonPropsType,
  WalletConnectLoginButtonPropsType,
  WebWalletLoginButtonPropsType,
  OperaWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  RawAbiType,
  VerifiedContractType,
  NetworkType,
  InterfaceIconsType,
  CustomClassNamesType,
  UserInterfaceType
} from 'types';

export interface SCExplorerType extends UserInterfaceType {
  accountConsumerHandlers: AccountConsumerHandlersType;
  networkConfig: NetworkType;
  smartContract: SmartContractInitialType;
  customClassNames?: CustomClassNamesType;
  icons?: InterfaceIconsType;
  config?: ConfigType;
  loaderComponent?: React.ReactNode;
  children?: React.ReactNode;
  activeSection?: VerifiedContractTabsEnum;
  setActiveSection?: React.Dispatch<
    React.SetStateAction<VerifiedContractTabsEnum>
  >;
}

export interface SmartContractInitialType {
  canMutate?: boolean;
  canLoadAbi?: boolean;
  canDeploy?: boolean;
  canUpgrade?: boolean;
  contractAddress?: string;
  abi?: RawAbiType;
  verifiedContract?: VerifiedContractType;
  deployedContractDetails?: AccountType;
}

export interface ConfigType {
  loginParams?: LoginParamsType;
}

export type AccountConsumerHandlersType = {
  useGetLoginInfo: () => {
    isLoggedIn: boolean;
  };
  useGetAccountInfo: () => {
    address: string;
    account: { isGuarded: boolean; balance: string; nonce: number };
  };
  onLoginClick?: () => void;
};

export type LoginParamsType =
  | ExtensionLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | OperaWalletLoginButtonPropsType;

export enum VerifiedContractTabsEnum {
  details = 'details',
  sourceCode = 'source',
  endpoints = 'endpoints',
  readEndpoints = 'endpoints-read',
  writeEndpoints = 'endpoints-write',
  events = 'events',
  types = 'types',
  contractConstructor = 'constructor',
  loadAbi = 'load-abi',
  deploy = 'deploy',
  upgrade = 'upgrade'
}

export enum MetadataFieldsEnum {
  readable = 'readable',
  upgradeable = 'upgradeable',
  payable = 'payable',
  payableBySc = 'payableBySc'
}
export type MetadataOptionsType = {
  [key in MetadataFieldsEnum]: { label: string; checked: boolean };
};
