import { useProviderConfig } from './useProviderConfig';

export const useNetworkProvider = () => {
  const { get, post } = useProviderConfig();

  return {
    get,
    post
  };
};
