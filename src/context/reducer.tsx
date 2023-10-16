import { ActionType, ActionTypeEnum, StateType } from './types';

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case ActionTypeEnum.setDappEnvironment: {
      return {
        ...state,
        environment: action.environment
      };
    }
    case ActionTypeEnum.setNetworkConfig: {
      return {
        ...state,
        networkConfig: action.networkConfig
      };
    }
    case ActionTypeEnum.setProvider: {
      return {
        ...state,
        provider: action.provider
      };
    }
    case ActionTypeEnum.setOwnerAddress: {
      return {
        ...state,
        ownerAddress: action.ownerAddress
      };
    }
    case ActionTypeEnum.setVerifiedContract: {
      return {
        ...state,
        verifiedContract: action.verifiedContract
      };
    }
    case ActionTypeEnum.setRawAbi: {
      return {
        ...state,
        rawAbi: action.rawAbi
      };
    }
    case ActionTypeEnum.setAbiRegistry: {
      return {
        ...state,
        abiRegistry: action.abiRegistry
      };
    }
    case ActionTypeEnum.setCanView: {
      return {
        ...state,
        canView: action.canView
      };
    }
    case ActionTypeEnum.setCanRead: {
      return {
        ...state,
        canRead: action.canRead
      };
    }
    case ActionTypeEnum.setCanMutate: {
      return {
        ...state,
        canMutate: action.canMutate
      };
    }
    case ActionTypeEnum.setLoginModalOpen: {
      return {
        ...state,
        loginModalOpen: action.loginModalOpen
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};

export { reducer };
