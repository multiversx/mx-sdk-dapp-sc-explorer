import React from 'react';
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
  smartContract: SmartContractType;
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

export interface SmartContractType {
  contractAddress?: string;
  ownerAddress?: string;
  allowMutate?: boolean;
  abi?: RawAbiType;
  verifiedContract?: VerifiedContractType;
}

export type AccountConsumerHandlersType = {
  useGetLoginInfo: () => {
    isLoggedIn: boolean;
  };
  useGetAccountInfo: () => {
    address: string;
    account: { isGuarded: boolean; balance: string };
  };
};

export enum VerifiedContractTabsEnum {
  details = 'details',
  sourceCode = 'source',
  endpoints = 'endpoints',
  readEndpoints = 'endpoints-read',
  writeEndpoints = 'endpoints-write',
  events = 'events',
  types = 'types',
  contractConstructor = 'constructor'
}
