import {
  SmartContractStateType,
  SmartContractDispatchTypeEnum,
  SmartContractDispatchActionType
} from './types';

export const reducer = (
  state: SmartContractStateType,
  action: SmartContractDispatchActionType
) => {
  switch (action.type) {
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
