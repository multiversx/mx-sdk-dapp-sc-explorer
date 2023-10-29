import React from 'react';

import { Layout } from 'components';
import { AppContextProvider } from 'contexts';
import { SCExplorerType } from 'types';

export function ScExplorerContainer(props: SCExplorerType) {
  const {
    children,
    networkConfig,
    customClassNames,
    icons,
    smartContract,
    accountConsumerHandlers
  } = props;

  return (
    <AppContextProvider
      networkConfig={networkConfig}
      smartContract={smartContract}
      customClassNames={customClassNames ?? {}}
      icons={icons ?? {}}
      accountConsumerHandlers={accountConsumerHandlers}
    >
      {children ? children : <Layout {...props} />}
    </AppContextProvider>
  );
}
