import { useScContext } from 'context';
import { ContractEndpointMutabilityEnum } from 'types';

export const useSupport = () => {
  const { canView, canRead, canMutate, rawAbi, verifiedContract, abiRegistry } =
    useScContext();

  const hasBuildInfo = Boolean(rawAbi?.buildInfo || rawAbi?.name);

  const hasSourceCode =
    verifiedContract?.source?.contract?.entries &&
    verifiedContract.source.contract.entries.length > 0;

  const hasEndpoints =
    abiRegistry?.endpoints && abiRegistry.endpoints.length > 0;
  const hasReadEndpoints =
    hasEndpoints &&
    abiRegistry.endpoints.some(
      (endpoint) =>
        endpoint?.modifiers?.mutability ===
        ContractEndpointMutabilityEnum.readonly
    );
  const hasWriteEndpoints =
    hasEndpoints &&
    abiRegistry.endpoints.some(
      (endpoint) =>
        endpoint?.modifiers?.mutability ===
        ContractEndpointMutabilityEnum.mutable
    );
  const hasEvents = rawAbi?.events && rawAbi.events.length > 0;
  const hasTypes =
    abiRegistry?.customTypes && abiRegistry.customTypes.length > 0;
  const hasConstructor = Boolean(rawAbi?.['constructor']);

  return {
    canView,
    canRead,
    canMutate,
    hasBuildInfo,
    hasSourceCode,
    hasEndpoints,
    hasReadEndpoints,
    hasWriteEndpoints,
    hasEvents,
    hasTypes,
    hasConstructor
  };
};
