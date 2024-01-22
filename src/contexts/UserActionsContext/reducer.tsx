import {
  UserActionStateType,
  UserActionDispatchTypeEnum,
  UserActionDispatchActionType
} from './types';

export const reducer = (
  state: UserActionStateType,
  action: UserActionDispatchActionType
) => {
  switch (action.type) {
    case UserActionDispatchTypeEnum.setLoginModalState: {
      return {
        ...state,
        loginModalState: action.loginModalState
      };
    }

    case UserActionDispatchTypeEnum.setMutateModalState: {
      return {
        ...state,
        mutateModalState: action.mutateModalState
      };
    }

    case UserActionDispatchTypeEnum.setDeployModalState: {
      return {
        ...state,
        deployModalState: action.deployModalState
      };
    }

    case UserActionDispatchTypeEnum.setUpgradeModalState: {
      return {
        ...state,
        upgradeModalState: action.upgradeModalState
      };
    }

    case UserActionDispatchTypeEnum.setAccountTokensState: {
      return {
        ...state,
        accountTokens: action.accountTokens
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};
