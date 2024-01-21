import React, { useContext, ReactNode, createContext } from 'react';

import { ContractEndpointMutabilityEnum, SupportType } from 'types';
import { useConfigContext } from './ConfigContext';
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
  const config = useConfigContext();
  const { rawAbi, verifiedContract, abiRegistry, deployedContractDetails } =
    smartContract;
  const {
    canMutate,
    canLoadAbi,
    canDeploy,
    canUpgrade,
    canDisplayContractDetails
  } = config;

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

  const rawAbiConstructor = rawAbi?.['constructor'];
  const abiConstructor = abiRegistry?.constructorDefinition;
  const hasConstructor =
    abiConstructor &&
    ((abiConstructor?.input && abiConstructor.input.length > 0) ||
      (abiConstructor?.output && abiConstructor.output.length > 0) ||
      (rawAbiConstructor?.docs && rawAbiConstructor.docs.length > 0));

  const value = {
    canUpgrade: Boolean(canUpgrade),
    canDeploy: Boolean(canDeploy),
    canLoadAbi: Boolean(canLoadAbi),
    canView: Boolean(abiRegistry),
    canDisplayContractDetails: Boolean(canDisplayContractDetails),
    canRead: Boolean(
      abiRegistry && networkConfig && deployedContractDetails?.code
    ),
    canMutate: Boolean(
      abiRegistry && networkConfig && deployedContractDetails?.code && canMutate
    ),
    hasBuildInfo: Boolean(hasBuildInfo),
    hasSourceCode: Boolean(hasSourceCode),
    hasEndpoints: Boolean(hasEndpoints),
    hasReadEndpoints: Boolean(hasReadEndpoints),
    hasWriteEndpoints: Boolean(hasWriteEndpoints),
    hasEvents: Boolean(hasEvents),
    hasTypes: Boolean(hasTypes),
    hasConstructor: Boolean(hasConstructor),
    hasContractDetails: Boolean(
      canDisplayContractDetails && deployedContractDetails?.code
    )
  };

  return (
    <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
  );
}

export function useSupportContext() {
  return useContext(SupportContext);
}
