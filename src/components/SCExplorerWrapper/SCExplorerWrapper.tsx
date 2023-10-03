import React from 'react';
import { ContextProvider } from 'context';
import { SCExplorerType } from 'types';
import { AppWrapper } from './AppWrapper';

export const SCExplorerWrapper = (props: SCExplorerType) => {
  const { children } = props;

  return (
    <ContextProvider>
      <AppWrapper {...props}>{children}</AppWrapper>
    </ContextProvider>
  );
};
