import React from 'react';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';
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
  smartContract: SmartContractInitialType;
  networkConfig: NetworkType;
  icons?: InterfaceIconsType;
  customClassNames?: CustomClassNamesType;
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
