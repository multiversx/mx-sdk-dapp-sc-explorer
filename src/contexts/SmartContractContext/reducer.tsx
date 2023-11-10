import {
  SmartContractStateType,
  SmartContractDispatchTypeEnum,
  SmartContractDispatchActionType
} from './types';

const reducer = (
  state: SmartContractStateType,
  action: SmartContractDispatchActionType
) => {
  switch (action.type) {
    case SmartContractDispatchTypeEnum.setCanMutate: {
      return {
        ...state,
        canMutate: action.canMutate
      };
    }
    case SmartContractDispatchTypeEnum.setCanLoadAbi: {
      return {
        ...state,
        canLoadAbi: action.canLoadAbi
      };
    }
    case SmartContractDispatchTypeEnum.setCanDeploy: {
      return {
        ...state,
        canDeploy: action.canDeploy
      };
    }
    case SmartContractDispatchTypeEnum.setCanUpdate: {
      return {
        ...state,
        canUpdate: action.canUpdate
      };
    }
    case SmartContractDispatchTypeEnum.setAbiRegistry: {
      return {
        ...state,
        abiRegistry: action.abiRegistry
      };
    }
    case SmartContractDispatchTypeEnum.setRawAbi: {
      return {
        ...state,
        rawAbi: action.rawAbi
      };
    }
    case SmartContractDispatchTypeEnum.setVerifiedContract: {
      return {
        ...state,
        verifiedContract: action.verifiedContract
      };
    }
    case SmartContractDispatchTypeEnum.setContractAddress: {
      return {
        ...state,
        contractAddress: action.contractAddress
      };
    }
    case SmartContractDispatchTypeEnum.setDeployedContractDetails: {
      return {
        ...state,
        deployedContractDetails: action.deployedContractDetails
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};

export { reducer };
