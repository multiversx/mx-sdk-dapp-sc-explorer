import { chainIdSelector, getState } from 'lib';

export const getChainId = () => {
  return chainIdSelector(getState());
};
