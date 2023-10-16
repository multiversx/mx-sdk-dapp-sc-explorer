import React from 'react';
import { ContextProvider } from 'context';
import { SCExplorerType } from 'types';
import { AppStateWrapper } from './AppStateWrapper';

export const SCExplorerWrapper = (props: SCExplorerType) => {
  const { children } = props;

  return (
    <ContextProvider>
      <AppStateWrapper {...props}>{children}</AppStateWrapper>
    </ContextProvider>
  );
};
