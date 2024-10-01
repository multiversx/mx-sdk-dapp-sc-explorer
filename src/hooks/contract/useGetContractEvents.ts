import { useSCExplorerContext } from 'contexts';

export const useGetContractEvents = () => {
  const { smartContract, support } = useSCExplorerContext();
  const { rawAbi } = smartContract;
  const { hasEvents } = support;

  if (!hasEvents) {
    return [];
  }

  const events = rawAbi?.events ?? [];

  return events;
};
