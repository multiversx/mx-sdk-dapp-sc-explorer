import React, { useContext, ReactNode, createContext } from 'react';
import { AccountType } from '@multiversx/sdk-dapp/types/account.types';

import { AccountConsumerHandlersType } from 'types';

export interface AccountContextPropsType {
  address: AccountType['address'];
  isLoggedIn: boolean;
  isGuarded: boolean;
}

interface AccountContextProviderPropsType {
  children: ReactNode;
  value: AccountConsumerHandlersType;
}

export const AccountContext = createContext({} as AccountContextPropsType);

export function AccountContextProvider({
  children,
  value
}: AccountContextProviderPropsType) {
  const { useGetLoginInfo, useGetAccountInfo } = value;
  const { isLoggedIn } = useGetLoginInfo();
  const { address, isGuarded } = useGetAccountInfo();
  const account = {
    address,
    isLoggedIn,
    isGuarded
  };

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}
