import React, { ReactNode } from 'react';
import {
  AccountConsumerHandlersType,
  CustomClassNamesType,
  ConfigType,
  InterfaceIconsType,
  NetworkType,
  SmartContractInitialType
} from 'types';
import { AccountContextProvider } from './AccountContext';
import { ConfigContextProvider } from './ConfigContext';
import { CustomClassNamesContextProvider } from './CustomClassNamesContext';
import { IconsContextProvider } from './IconsContext';
import { NetworkContextProvider } from './NetworkContext';
import { SCExplorerContextProvider } from './SCExplorerContextProvider';
import { SmartContractContextProvider } from './SmartContractContext';
import { SupportContextProvider } from './SupportContext';
import { UserActionsContextProvider } from './UserActionsContext';

interface AppContextProviderPropsType {
  accountConsumerHandlers: AccountConsumerHandlersType;
  networkConfig: NetworkType;
  smartContract?: SmartContractInitialType;
  customClassNames?: CustomClassNamesType;
  icons?: InterfaceIconsType;
  config?: ConfigType;
  children: ReactNode;
}
export function AppContextProvider({
  networkConfig,
  accountConsumerHandlers,
  smartContract = {},
  customClassNames = {},
  icons = {},
  config = {},
  children
}: AppContextProviderPropsType) {
  return (
    <CustomClassNamesContextProvider value={customClassNames}>
      <IconsContextProvider value={icons}>
        <NetworkContextProvider value={networkConfig}>
          <SmartContractContextProvider value={smartContract}>
            <AccountContextProvider value={accountConsumerHandlers}>
              <ConfigContextProvider value={config}>
                <SupportContextProvider>
                  <UserActionsContextProvider>
                    <SCExplorerContextProvider>
                      {children}
                    </SCExplorerContextProvider>
                  </UserActionsContextProvider>
                </SupportContextProvider>
              </ConfigContextProvider>
            </AccountContextProvider>
          </SmartContractContextProvider>
        </NetworkContextProvider>
      </IconsContextProvider>
    </CustomClassNamesContextProvider>
  );
}

export * from './UserActionsContext';
export * from './SmartContractContext';
export * from './SCExplorerContextProvider';
