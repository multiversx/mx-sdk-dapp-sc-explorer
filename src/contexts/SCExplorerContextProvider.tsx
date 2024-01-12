import React, { useContext, createContext, ReactNode } from 'react';

import {
  CustomClassNamesType,
  InterfaceIconsType,
  NetworkType,
  SupportType,
  SmartContractStateType,
  UserActionStateType,
  ConfigType
} from 'types';
import { useAccountContext, AccountContextPropsType } from './AccountContext';
import { useConfigContext } from './ConfigContext';
import { useCustomClassNamesContext } from './CustomClassNamesContext';
import { useIconsContext } from './IconsContext';
import { useNetworkConfigContext } from './NetworkContext';
import { useSmartContractContext } from './SmartContractContext';
import { useSupportContext } from './SupportContext';
import { useUserActionsContext } from './UserActionsContext';

export interface SCExplorerContextPropsType {
  accountInfo: AccountContextPropsType;
  customClassNames: CustomClassNamesType;
  icons: InterfaceIconsType;
  networkConfig: NetworkType;
  smartContract: SmartContractStateType;
  support: SupportType;
  userActionsState: UserActionStateType;
  config: ConfigType;
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
  const support = useSupportContext();
  const accountInfo = useAccountContext();
  const networkConfig = useNetworkConfigContext();
  const smartContract = useSmartContractContext();
  const userActionsState = useUserActionsContext();
  const customClassNames = useCustomClassNamesContext();
  const icons = useIconsContext();
  const config = useConfigContext();

  return (
    <SCExplorerContext.Provider
      value={{
        support,
        accountInfo,
        networkConfig,
        smartContract,
        userActionsState,
        customClassNames,
        icons,
        config
      }}
    >
      {children}
    </SCExplorerContext.Provider>
  );
}

export function useSCExplorerContext() {
  return useContext(SCExplorerContext);
}
