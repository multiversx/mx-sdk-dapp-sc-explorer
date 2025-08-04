import { useSCExplorerContext } from 'contexts';
import { getNetworkEntrypoint } from 'helpers';

export const useGetEntrypoint = () => {
  const { networkConfig } = useSCExplorerContext();

  return getNetworkEntrypoint({ network: networkConfig });
};
