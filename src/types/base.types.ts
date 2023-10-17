import React from 'react';
import { DappProviderPropsType } from '@multiversx/sdk-dapp/wrappers';
import {
  RawAbiType,
  VerifiedContractType,
  NetworkType,
  CustomUIType
} from 'types';

export interface SCExplorerType extends DappProviderPropsType {
  networkConfig?: NetworkType;
  provider?: 'api' | 'proxy';
  address?: string;
  abi?: RawAbiType;
  verifiedContract?: VerifiedContractType;
  allowMutate?: boolean;
  loaderComponent?: React.ReactNode;
  customInterface?: CustomUIType;
  className?: string;
  'data-testid'?: string;
}

export interface DocumentedTypesExampleType {
  type: string;
  example?: string | number;
  docs?: string;
  validationType?: string;
  inputType?: string;
}
