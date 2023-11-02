import {
  IContractFunction,
  TypedValue,
  AbiRegistry
} from '@multiversx/sdk-core/out';
import {
  EsdtEnumType,
  NftEnumType
} from '@multiversx/sdk-dapp/types/tokens.types';

export interface DocumentedTypesExampleType {
  type: string;
  example?: string | number;
  docs?: string;
  validationType?: string;
  inputType?: string;
}

export interface ProcessedFormTokenType {
  tokenAmount: string;
  tokenIdentifier: string;
  tokenDecimals: number;
  tokenType: EsdtEnumType | NftEnumType | 'native' | '';
  tokenNonce?: number;
}

export interface GetCallContractTransactionType {
  contractAddress?: string;
  callerAddress?: string;
  abiRegistry?: AbiRegistry;
  func?: IContractFunction;
  args?: TypedValue[];
  userGasLimit?: string | number;
  tokens?: ProcessedFormTokenType[];
}
