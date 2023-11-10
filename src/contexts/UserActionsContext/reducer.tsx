import {
  UserActionStateType,
  UserActionDispatchTypeEnum,
  UserActionDispatchActionType
} from './types';

const reducer = (
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

export { reducer };
