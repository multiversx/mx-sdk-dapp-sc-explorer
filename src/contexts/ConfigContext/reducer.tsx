import {
  ConfigStateType,
  ConfigDispatchTypeEnum,
  ConfigDispatchActionType
} from './types';

export const reducer = (
  state: ConfigStateType,
  action: ConfigDispatchActionType
) => {
  switch (action.type) {
    case ConfigDispatchTypeEnum.setCanMutate: {
      return {
        ...state,
        canMutate: action.canMutate
      };
    }
    case ConfigDispatchTypeEnum.setCanLoadAbi: {
      return {
        ...state,
        canLoadAbi: action.canLoadAbi
      };
    }
    case ConfigDispatchTypeEnum.setCanDeploy: {
      return {
        ...state,
        canDeploy: action.canDeploy
      };
    }
    case ConfigDispatchTypeEnum.setCanUpgrade: {
      return {
        ...state,
        canUpgrade: action.canUpgrade
      };
    }
    case ConfigDispatchTypeEnum.setCanDisplayContractDetails: {
      return {
        ...state,
        canDisplayContractDetails: action.canDisplayContractDetails
      };
    }
    case ConfigDispatchTypeEnum.setLoginParams: {
      return {
        ...state,
        loginParams: action.loginParams
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};
