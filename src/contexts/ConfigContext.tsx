import React, { useContext, ReactNode, createContext } from 'react';
import { ConfigType } from 'types';

interface ConfigContextProviderPropsType {
  children: ReactNode;
  value: ConfigType;
}

export const ConfigContext = createContext({} as ConfigType);

export function ConfigContextProvider({
  children,
  value
}: ConfigContextProviderPropsType) {
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfigContext() {
  return useContext(ConfigContext);
}
