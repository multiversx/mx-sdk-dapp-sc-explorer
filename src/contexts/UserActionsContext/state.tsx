import { UserActionsStateType } from '../types';

export const initializer: UserActionsStateType = {
  loginModalState: {
    loginModalOpen: false
  },
  mutateModalState: {
    mutateModalOpen: false,
    args: [],
    endpoint: undefined
  },
  accountTokens: [],
  accountNfts: []
};
