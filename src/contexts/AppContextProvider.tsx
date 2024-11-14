import React, { ReactNode } from 'react';
import {
  AccountConsumerHandlersType,
  CustomClassNamesType,
  ConfigType,
  InterfaceIconsType,
  NetworkType,
  SmartContractConfigType
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
  smartContract?: SmartContractConfigType;
  config?: ConfigType;
  customClassNames?: CustomClassNamesType;
  icons?: InterfaceIconsType;
  children: ReactNode;
}
export function AppContextProvider({
  networkConfig,
  accountConsumerHandlers,
  smartContract = {},
  config = {},
  customClassNames = {},
  icons = {},
  children
}: AppContextProviderPropsType) {
  return (
    <CustomClassNamesContextProvider value={customClassNames}>
      <IconsContextProvider value={icons}>
        <NetworkContextProvider value={networkConfig}>
          <ConfigContextProvider value={config}>
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
          </ConfigContextProvider>
        </NetworkContextProvider>
      </IconsContextProvider>
    </CustomClassNamesContextProvider>
  );
}
