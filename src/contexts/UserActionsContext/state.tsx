import { UserActionsType } from '../types';

export const initializer: UserActionsType = {
  loginModalOpen: false,
  mutateModalState: {
    mutateModalOpen: false,
    args: [],
    endpoint: undefined
  }
};
