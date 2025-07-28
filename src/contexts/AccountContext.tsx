import React, { useContext, ReactNode, createContext } from 'react';

import { AccountType } from 'lib';
import { AccountConsumerHandlersType } from 'types';

export interface AccountContextPropsType {
  address: AccountType['address'];
  balance: AccountType['balance'];
  nonce: AccountType['nonce'];
  isLoggedIn: boolean;
  isGuarded: boolean;
  onLoginClick?: (() => void) | undefined;
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
  const { useGetLoginInfo, useGetAccountInfo, onLoginClick } = value;
  const { isLoggedIn } = useGetLoginInfo();
  const { address, account } = useGetAccountInfo();
  const { isGuarded, balance, nonce } = account ?? {};
  const stateAccount = {
    address,
    balance,
    isLoggedIn,
    isGuarded,
    nonce,
    ...(onLoginClick ? { onLoginClick } : {})
  };

  return (
    <AccountContext.Provider value={stateAccount}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}
