import { ActionType, ActionTypeEnum, UserActionsType } from '../types';

const reducer = (state: UserActionsType, action: ActionType) => {
  switch (action.type) {
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
