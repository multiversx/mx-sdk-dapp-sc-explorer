import React from 'react';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { SCExplorerType } from 'types';

export const SdkDappProvider = (props: SCExplorerType) => {
  const { children, environment, customNetworkConfig } = props;

  return (
    <DappProvider
      environment={environment}
      customNetworkConfig={{
        ...customNetworkConfig,
        name: 'customConfig',
        skipFetchFromServer: true
      }}
    >
      {children}
    </DappProvider>
  );
};
