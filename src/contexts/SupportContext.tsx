import React, { useContext, ReactNode, createContext } from 'react';

import { ContractEndpointMutabilityEnum, SupportType } from 'types';
import { useNetworkConfigContext } from './NetworkContext';
import { useSmartContractContext } from './SmartContractContext';

interface SupportContextProviderPropsType {
  children: ReactNode;
}

export const SupportContext = createContext({} as SupportType);

export function SupportContextProvider({
  children
}: SupportContextProviderPropsType) {
  const networkConfig = useNetworkConfigContext();
  const smartContract = useSmartContractContext();
  const { rawAbi, verifiedContract, abiRegistry, allowMutate } = smartContract;

  const hasBuildInfo = rawAbi?.buildInfo || rawAbi?.name;

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
  const hasConstructor = rawAbi?.['constructor'];

  const value = {
    canView: Boolean(abiRegistry),
    canRead: Boolean(abiRegistry && networkConfig),
    canMutate: Boolean(abiRegistry && networkConfig && allowMutate),
    hasBuildInfo: Boolean(hasBuildInfo),
    hasSourceCode: Boolean(hasSourceCode),
    hasEndpoints: Boolean(hasEndpoints),
    hasReadEndpoints: Boolean(hasReadEndpoints),
    hasWriteEndpoints: Boolean(hasWriteEndpoints),
    hasEvents: Boolean(hasEvents),
    hasTypes: Boolean(hasTypes),
    hasConstructor: Boolean(hasConstructor)
  };

  return (
    <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
  );
}

export function useSupportContext() {
  return useContext(SupportContext);
}
