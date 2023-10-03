import { StateType } from './types';

export const initializer: StateType = {
  environment: undefined,
  networkConfig: undefined,
  rawAbi: undefined,
  abiRegistry: undefined,
  ownerAddress: undefined,
  verifiedContract: undefined,
  canView: false,
  canRead: false,
  canMutate: false,
  provider: 'api'
};
