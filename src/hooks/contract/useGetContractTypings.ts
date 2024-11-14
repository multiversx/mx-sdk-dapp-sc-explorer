import { useSCExplorerContext } from 'contexts';

export const useGetContractTypings = () => {
  const { smartContract, support } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { hasTypes } = support;

  if (!hasTypes) {
    return [];
  }

  const customTypes = abiRegistry?.customTypes ?? [];

  return customTypes;
};
