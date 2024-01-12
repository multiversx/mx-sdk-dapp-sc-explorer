import React from 'react';

import { Layout } from 'components';
import { AppContextProvider } from 'contexts';
import { SCExplorerType } from 'types';

export function ScExplorerContainer(props: SCExplorerType) {
  const {
    accountConsumerHandlers,
    networkConfig,
    smartContract,
    customClassNames,
    icons,
    config,
    children
  } = props;

  return (
    <AppContextProvider
      accountConsumerHandlers={accountConsumerHandlers}
      networkConfig={networkConfig}
      smartContract={smartContract}
      customClassNames={customClassNames ?? {}}
      icons={icons ?? {}}
      config={config ?? {}}
    >
      {children ? children : <Layout {...props} />}
    </AppContextProvider>
  );
}
