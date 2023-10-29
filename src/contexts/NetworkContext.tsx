import React, { useContext, ReactNode, createContext } from 'react';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { NetworkType } from 'types';

export interface NetworkContextPropsType {
  networkConfig: NetworkType;
}

interface NetworkContextProviderPropsType {
  children: ReactNode;
  value?: NetworkType;
}

export const NetworkContext = createContext({} as NetworkType);

export function NetworkContextProvider({
  children,
  value
}: NetworkContextProviderPropsType) {
  const networkConfig = value ?? {
    ...fallbackNetworkConfigurations['devnet'],
    provider: 'api'
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
