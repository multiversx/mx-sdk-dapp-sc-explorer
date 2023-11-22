import { SmartContractStateType } from './types';

export const initializer: SmartContractStateType = {
  canMutate: false,
  canLoadAbi: false,
  canDeploy: false,
  canUpgrade: false,
  contractAddress: '',
  rawAbi: undefined,
  abiRegistry: undefined,
  verifiedContract: undefined,
  deployedContractDetails: undefined
};
