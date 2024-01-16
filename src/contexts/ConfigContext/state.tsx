import { ConfigStateType } from './types';

export const initializer: ConfigStateType = {
  canMutate: false,
  canLoadAbi: false,
  canDeploy: false,
  canUpgrade: false,
  canDisplayContractDetails: false,
  loginParams: undefined
};
