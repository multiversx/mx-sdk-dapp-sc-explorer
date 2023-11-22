import { AbiRegistry } from '@multiversx/sdk-core/out';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';
import { RawAbiType, VerifiedContractType } from 'types';

export interface SmartContractStateType {
  canMutate: boolean | undefined;
  canLoadAbi: boolean | undefined;
  canDeploy: boolean | undefined;
  canUpgrade: boolean | undefined;
  contractAddress: string | undefined;
  rawAbi: RawAbiType | undefined;
  abiRegistry: AbiRegistry | undefined;
  verifiedContract: VerifiedContractType | undefined;
  deployedContractDetails: AccountType | undefined;
}

export enum SmartContractDispatchTypeEnum {
  setCanMutate = 'setCanMutate',
  setCanLoadAbi = 'setCanLoadAbi',
  setCanDeploy = 'setCanDeploy',
  setCanUpgrade = 'setCanUpgrade',
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
  canMutate?: boolean;
  canLoadAbi?: boolean;
  canDeploy?: boolean;
  canUpgrade?: boolean;
  contractAddress?: string;
  rawAbi?: RawAbiType;
  abiRegistry?: AbiRegistry;
  verifiedContract?: VerifiedContractType;
  deployedContractDetails?: AccountType;
}
