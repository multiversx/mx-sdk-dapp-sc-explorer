import React, { ReactNode } from 'react';
import {
  AccountConsumerHandlersType,
  CustomClassNamesType,
  InterfaceIconsType,
  NetworkType,
  SmartContractType
} from 'types';
import { AccountContextProvider } from './AccountContext';
import { CustomClassNamesContextProvider } from './CustomClassNamesContext';
import { IconsContextProvider } from './IconsContext';
import { NetworkContextProvider } from './NetworkContext';
import { SCExplorerContextProvider } from './SCExplorerContextProvider';
import { SmartContractContextProvider } from './SmartContractContext';
import { SupportContextProvider } from './SupportContext';
import { UserActionsContextProvider } from './UserActionsContext';

interface AppContextProviderPropsType {
  accountConsumerHandlers: AccountConsumerHandlersType;
  networkConfig?: NetworkType;
  smartContract?: SmartContractType;
  customClassNames?: CustomClassNamesType;
  icons?: InterfaceIconsType;
  children: ReactNode;
}
export function AppContextProvider({
  networkConfig,
  accountConsumerHandlers,
  smartContract = {},
  customClassNames = {},
  icons = {},
  children
}: AppContextProviderPropsType) {
  return (
    <CustomClassNamesContextProvider value={customClassNames}>
      <IconsContextProvider value={icons}>
        <NetworkContextProvider value={networkConfig}>
          <SmartContractContextProvider value={smartContract}>
            <AccountContextProvider value={accountConsumerHandlers}>
              <SupportContextProvider>
                <UserActionsContextProvider>
                  <SCExplorerContextProvider>
                    {children}
                  </SCExplorerContextProvider>
                </UserActionsContextProvider>
              </SupportContextProvider>
            </AccountContextProvider>
          </SmartContractContextProvider>
        </NetworkContextProvider>
      </IconsContextProvider>
    </CustomClassNamesContextProvider>
  );
}

export * from './UserActionsContext';
export * from './SCExplorerContextProvider';
