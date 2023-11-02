import { ActionType, ActionTypeEnum, UserActionsStateType } from '../types';

const reducer = (state: UserActionsStateType, action: ActionType) => {
  switch (action.type) {
    case ActionTypeEnum.setLoginModalState: {
      return {
        ...state,
        loginModalState: action.loginModalState
      };
    }

    case ActionTypeEnum.setMutateModalState: {
      return {
        ...state,
        mutateModalState: action.mutateModalState
      };
    }

    case ActionTypeEnum.setAccountTokensState: {
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

export { reducer };
