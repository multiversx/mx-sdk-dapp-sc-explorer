import { OnProviderLoginType } from 'lib';

export interface ConfigStateType {
  canMutate: boolean | undefined;
  canLoadAbi: boolean | undefined;
  canDeploy: boolean | undefined;
  canUpgrade: boolean | undefined;
  canDisplayContractDetails: boolean | undefined;
  loginParams: OnProviderLoginType | undefined;
  hasViewInExplorer: boolean | undefined;
  hasGeneralLogin: boolean | undefined;
}

export enum ConfigDispatchTypeEnum {
  setCanMutate = 'setCanMutate',
  setCanLoadAbi = 'setCanLoadAbi',
  setCanDeploy = 'setCanDeploy',
  setCanUpgrade = 'setCanUpgrade',
  setCanDisplayContractDetails = 'setCanDisplayContractDetails',
  setLoginParams = 'setLoginParams',
  setHasViewInExplorer = 'setHasViewInExplorer',
  setHasGeneralLogin = 'setHasGeneralLogin'
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
  hasViewInExplorer?: boolean;
  hasGeneralLogin?: boolean;
}
