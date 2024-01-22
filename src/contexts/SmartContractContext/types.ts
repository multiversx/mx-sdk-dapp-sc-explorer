import { AbiRegistry } from '@multiversx/sdk-core/out';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';
import { RawAbiType, VerifiedContractType } from 'types';

export interface SmartContractStateType {
  contractAddress: string | undefined;
  rawAbi: RawAbiType | undefined;
  abiRegistry: AbiRegistry | undefined;
  verifiedContract: VerifiedContractType | undefined;
  deployedContractDetails: AccountType | undefined;
}

export enum SmartContractDispatchTypeEnum {
  setContractAddress = 'setContractAddress',
  setRawAbi = 'setRawAbi',
  setAbiRegistry = 'setAbiRegistry',
  setVerifiedContract = 'setVerifiedContract',
  setDeployedContractDetails = 'setDeployedContractDetails'
}

export type SmartContractDispatchType = (
  action: SmartContractDispatchActionType
) => void;

export interface SmartContractDispatchActionType {
  type: SmartContractDispatchTypeEnum;
  contractAddress?: string;
  rawAbi?: RawAbiType;
  abiRegistry?: AbiRegistry;
  verifiedContract?: VerifiedContractType;
  deployedContractDetails?: AccountType;
}
