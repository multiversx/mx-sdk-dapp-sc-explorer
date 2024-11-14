import { CONTRACT_WRITE_ENDPOINT_HIDE_LIST } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { ContractEndpointMutabilityEnum } from 'types';

export const useGetContractEndpointCount = () => {
  const { smartContract } = useSCExplorerContext();
  const { abiRegistry } = smartContract;

  const readEndpointsCount = (
    abiRegistry?.endpoints?.filter(
      (endpoint) =>
        endpoint?.modifiers?.mutability ===
        ContractEndpointMutabilityEnum.readonly
    ) || []
  ).length;

  const writeEndpointsCount = (
    abiRegistry?.endpoints?.filter(
      (endpoint) =>
        endpoint?.modifiers?.mutability ===
          ContractEndpointMutabilityEnum.mutable &&
        !CONTRACT_WRITE_ENDPOINT_HIDE_LIST.includes(endpoint?.name)
    ) || []
  ).length;

  return {
    readEndpointsCount,
    writeEndpointsCount
  };
};
