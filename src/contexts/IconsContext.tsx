import React, { useContext, ReactNode, createContext } from 'react';
import { InterfaceIconsType } from 'types';

interface IconsContextProviderPropsType {
  children: ReactNode;
  value: InterfaceIconsType;
}

export const IconsContext = createContext({} as InterfaceIconsType);

export function IconsContextProvider({
  children,
  value
}: IconsContextProviderPropsType) {
  return (
    <IconsContext.Provider value={value}>{children}</IconsContext.Provider>
  );
}

export function useIconsContext() {
  return useContext(IconsContext);
}
