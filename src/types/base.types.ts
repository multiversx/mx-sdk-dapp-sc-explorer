import React from 'react';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';
import { OnProviderLoginType } from '@multiversx/sdk-dapp/types/login.types';
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
  smartContract?: SmartContractConfigType;
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

export interface SmartContractConfigType {
  contractAddress?: string;
  abi?: RawAbiType;
  verifiedContract?: VerifiedContractType;
  deployedContractDetails?: AccountType;
}

export interface ConfigType {
  canMutate?: boolean;
  canLoadAbi?: boolean;
  canDeploy?: boolean;
  canUpgrade?: boolean;
  canDisplayContractDetails?: boolean;
  loginParams?: OnProviderLoginType;
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

export enum VerifiedContractTabsEnum {
  details = 'details',
  contractDetails = 'contract-details',
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

export enum ContractPropertiesEnum {
  upgradeable = 'Upgradeable',
  readable = 'Readable',
  payable = 'Payable',
  payableBySc = 'Payable by Smart Contract'
}
