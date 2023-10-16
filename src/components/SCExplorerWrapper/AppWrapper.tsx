import React from 'react';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';

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
      <Layout {...props} />
    </DappProvider>
  );
};
