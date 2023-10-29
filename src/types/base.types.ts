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
  networkConfig?: NetworkType;
  icons?: InterfaceIconsType;
  customClassNames?: CustomClassNamesType;
  loaderComponent?: React.ReactNode;
  children?: React.ReactNode;
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
  useGetAccountInfo: () => { address: string; isGuarded: boolean };
};
