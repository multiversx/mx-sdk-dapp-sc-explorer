import React, { useContext, createContext, ReactNode } from 'react';

import {
  CustomClassNamesType,
  InterfaceIconsType,
  NetworkType,
  SupportType,
  UserActionsType
} from 'types';
import { useAccountContext, AccountContextPropsType } from './AccountContext';
import { useCustomClassNamesContext } from './CustomClassNamesContext';
import { useIconsContext } from './IconsContext';
import { useNetworkConfigContext } from './NetworkContext';
import {
  useSmartContractContext,
  SmartContractContextPropsType
} from './SmartContractContext';
import { useSupportContext } from './SupportContext';
import { useUserActionsContext } from './UserActionsContext';

export interface SCExplorerContextPropsType {
  accountInfo: AccountContextPropsType;
  customClassNames: CustomClassNamesType;
  icons: InterfaceIconsType;
  networkConfig: NetworkType;
  smartContract: SmartContractContextPropsType;
  support: SupportType;
  userActions: UserActionsType;
}

interface SCExplorerContextProviderPropsType {
  children: ReactNode;
}

export const SCExplorerContext = createContext(
  {} as SCExplorerContextPropsType
);

export function SCExplorerContextProvider({
  children
}: SCExplorerContextProviderPropsType) {
  const accountInfo = useAccountContext();
  const customClassNames = useCustomClassNamesContext();
  const icons = useIconsContext();
  const networkConfig = useNetworkConfigContext();
  const smartContract = useSmartContractContext();
  const support = useSupportContext();
  const userActions = useUserActionsContext();

  return (
    <SCExplorerContext.Provider
      value={{
        accountInfo,
        customClassNames,
        icons,
        networkConfig,
        smartContract,
        support,
        userActions
      }}
    >
      {children}
    </SCExplorerContext.Provider>
  );
}

export function useSCExplorerContext() {
  return useContext(SCExplorerContext);
}
