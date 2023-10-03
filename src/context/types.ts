import { AbiRegistry } from '@multiversx/sdk-core/out';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { NetworkType, VerifiedContractType, RawAbiType } from 'types';

export interface StateType {
  environment: EnvironmentsEnum | undefined;
  networkConfig: NetworkType | undefined;
  provider: 'api' | 'proxy' | undefined;
  ownerAddress: string | undefined;
  verifiedContract: VerifiedContractType | undefined;
  rawAbi: RawAbiType | undefined;
  abiRegistry: AbiRegistry | undefined;
  canView: boolean | undefined;
  canRead: boolean | undefined;
  canMutate: boolean | undefined;
}

export enum ActionTypeEnum {
  setDappEnvironment = 'setDappEnvironment',
  setNetworkConfig = 'setNetworkConfig',
  setProvider = 'setProvider',
  setVerifiedContract = 'setVerifiedContract',
  setOwnerAddress = 'setOwnerAddress',
  setRawAbi = 'setRawAbi',
  setAbiRegistry = 'setAbiRegistry',
  setCanView = 'setCanView',
  setCanRead = 'setCanRead',
  setCanMutate = 'setCanMutate'
}

export type DispatchType = (action: ActionType) => void;
export interface ActionType {
  type: ActionTypeEnum;
  environment?: EnvironmentsEnum;
  networkConfig?: NetworkType;
  provider?: 'api' | 'proxy';
  verifiedContract?: VerifiedContractType;
  ownerAddress?: string;
  rawAbi?: RawAbiType;
  abiRegistry?: AbiRegistry;
  canView?: boolean;
  canRead?: boolean;
  canMutate?: boolean;
}
