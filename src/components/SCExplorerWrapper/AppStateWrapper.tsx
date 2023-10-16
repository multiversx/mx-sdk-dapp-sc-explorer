import React from 'react';
import classNames from 'classnames';

import { usePrepareSCState } from 'hooks';
import { SCExplorerType } from 'types';
import { AppWrapper } from './AppWrapper';

export const AppStateWrapper = (props: SCExplorerType) => {
  const { children, className } = props;
  usePrepareSCState(props);

  return (
    <div className={classNames('mx-sdk-sc', className)}>
      {children ? children : <AppWrapper {...props} />}
    </div>
  );
};
