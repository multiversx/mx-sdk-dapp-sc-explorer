import React from 'react';
import { NotificationModal } from '@multiversx/sdk-dapp/UI/NotificationModal/NotificationModal';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList/TransactionsToastList';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider';

import { Layout } from 'components';
import { useScContext } from 'context';
import { SCExplorerType } from 'types';

export const AppWrapper = (props: SCExplorerType) => {
  const { customNetworkConfig } = props;
  const { canMutate, environment } = useScContext();

  if (!canMutate) {
    return <Layout {...props} />;
  }

  return (
    <DappProvider
      environment={environment}
      customNetworkConfig={{
        ...customNetworkConfig,
        name: 'sdk-sc-explorer',
        skipFetchFromServer: true
      }}
    >
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals />
      <Layout {...props} />
    </DappProvider>
  );
};
