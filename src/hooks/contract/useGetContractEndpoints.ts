import { CONTRACT_WRITE_ENDPOINT_HIDE_LIST } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { ContractEndpointMutabilityEnum } from 'types';

export const useGetContractEndpoints = ({
  mutability
}: {
  mutability?: ContractEndpointMutabilityEnum;
}) => {
  const { smartContract, support } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { hasEndpoints } = support;

  if (!hasEndpoints) {
    return [];
  }

  const endpoints = abiRegistry?.endpoints ?? [];
  let filteredEndpoints = endpoints;
  if (mutability) {
    filteredEndpoints = endpoints.filter(
      (endpoint) =>
        endpoint?.modifiers?.mutability === mutability &&
        !(
          endpoint?.modifiers?.mutability ===
            ContractEndpointMutabilityEnum.mutable &&
          CONTRACT_WRITE_ENDPOINT_HIDE_LIST.includes(endpoint?.name)
        )
    );
  }

  return filteredEndpoints;
};
