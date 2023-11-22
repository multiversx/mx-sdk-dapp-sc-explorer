import React, { useContext, ReactNode, createContext } from 'react';
import { CustomClassNamesType } from 'types';

interface CustomClassNamesContextProviderPropsType {
  children: ReactNode;
  value: CustomClassNamesType;
}

export const CustomClassNamesContext = createContext(
  {} as CustomClassNamesType
);

export function CustomClassNamesContextProvider({
  children,
  value
}: CustomClassNamesContextProviderPropsType) {
  return (
    <CustomClassNamesContext.Provider value={value}>
      {children}
    </CustomClassNamesContext.Provider>
  );
}

export function useCustomClassNamesContext() {
  return useContext(CustomClassNamesContext);
}
