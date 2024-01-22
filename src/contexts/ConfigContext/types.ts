import { OnProviderLoginType } from '@multiversx/sdk-dapp/types/login.types';

export interface ConfigStateType {
  canMutate: boolean | undefined;
  canLoadAbi: boolean | undefined;
  canDeploy: boolean | undefined;
  canUpgrade: boolean | undefined;
  canDisplayContractDetails: boolean | undefined;
  loginParams: OnProviderLoginType | undefined;
}

export enum ConfigDispatchTypeEnum {
  setCanMutate = 'setCanMutate',
  setCanLoadAbi = 'setCanLoadAbi',
  setCanDeploy = 'setCanDeploy',
  setCanUpgrade = 'setCanUpgrade',
  setCanDisplayContractDetails = 'setCanDisplayContractDetails',
  setLoginParams = 'setLoginParams'
}

export type ConfigDispatchType = (action: ConfigDispatchActionType) => void;

export interface ConfigDispatchActionType {
  type: ConfigDispatchTypeEnum;
  canMutate?: boolean;
  canLoadAbi?: boolean;
  canDeploy?: boolean;
  canUpgrade?: boolean;
  canDisplayContractDetails?: boolean;
  loginParams?: OnProviderLoginType;
}
