import { UserActionStateType } from './types';

export const initializer: UserActionStateType = {
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
