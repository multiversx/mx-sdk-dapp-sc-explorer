import { TypedValue, AbiRegistry, Code } from '@multiversx/sdk-core/out';
import {
  EsdtEnumType,
  NftEnumType
} from '@multiversx/sdk-dapp/types/tokens.types';
import { MetadataFieldsInitialValuesType } from 'types';

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
  tokenType: EsdtEnumType | NftEnumType | 'native' | string;
  tokenNonce: number;
}

export interface GetInteractionBaseTransactionType {
  callerAddress?: string;
  abiRegistry?: AbiRegistry;
  args?: TypedValue[];
  userGasLimit?: string | number;
  nonce?: number;
}

export interface GetCallContractTransactionType
  extends GetInteractionBaseTransactionType {
  contractAddress?: string;
  func?: string;
  tokens?: ProcessedFormTokenType[];
}

export interface GetDeployTransactionType
  extends GetInteractionBaseTransactionType {
  code: Code;
  metadata: MetadataFieldsInitialValuesType;
}

export interface GetUpgradeTransactionType
  extends GetInteractionBaseTransactionType {
  code: Code;
  metadata: MetadataFieldsInitialValuesType;
  contractAddress?: string;
}

export interface AssetsType {
  website?: string;
  description?: string;
  status?: string;
  pngUrl?: string;
  svgUrl?: string;
  social?: any;
}

export interface PartialTokenType {
  identifier: string;
  name: string;
  balance: string | null;
  ticker: string;
  assets?: AssetsType;
}

// includes MetaEsdts and egld exception
export interface PartialEsdtType extends PartialTokenType {
  decimals: number;
  type: EsdtEnumType | NftEnumType | 'native' | string;
  price?: string | number;
  nonce?: number;
}

export interface PartialNftType extends PartialTokenType {
  type: NftEnumType | string;
  nonce?: number;
}
