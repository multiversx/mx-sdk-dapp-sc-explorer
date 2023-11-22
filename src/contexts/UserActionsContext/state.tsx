import { UserActionStateType } from './types';

export const initializer: UserActionStateType = {
  loginModalState: {
    loginModalOpen: false
  },
  mutateModalState: {
    mutateModalOpen: false,
    args: [],
    endpoint: undefined,
    code: undefined
  },
  deployModalState: {
    deployModalOpen: false,
    args: [],
    endpoint: undefined,
    code: undefined
  },
  upgradeModalState: {
    upgradeModalOpen: false,
    args: [],
    endpoint: undefined,
    code: undefined
  },
  accountTokens: [],
  accountNfts: []
};
