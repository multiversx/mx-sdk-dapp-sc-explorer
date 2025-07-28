import React, { useContext, ReactNode, createContext } from 'react';

import { getNetworkEntrypoint } from 'helpers';
import { fallbackNetworkConfigurations } from 'lib';
import { NetworkType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
}

interface NetworkContextProviderPropsType {
  children: ReactNode;
  value: NetworkType;
}

export const NetworkContext = createContext({} as NetworkType);

export function NetworkContextProvider({
  children,
  value
}: NetworkContextProviderPropsType) {
  const fallback = fallbackNetworkConfigurations[value.environment];
  const networkEntrypoint = getNetworkEntrypoint({ network: value });
  const networkConfig = {
    environment: value.environment,
    provider: value?.provider ?? 'api',
    apiAddress: value?.apiAddress ?? fallback?.apiAddress,
    networkEntrypoint,
    ...(value?.proxyUrl ? { proxyUrl: value.proxyUrl } : {})
  };

  return (
    <NetworkContext.Provider value={networkConfig}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkConfigContext() {
  return useContext(NetworkContext);
}
