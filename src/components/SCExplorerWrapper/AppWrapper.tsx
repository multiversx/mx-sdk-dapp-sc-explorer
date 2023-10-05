import React, { memo } from 'react';
import classNames from 'classnames';

import { Layout } from 'components';
import { usePrepareSCState } from 'hooks';
import { SCExplorerType } from 'types';

export const AppWrapper = memo((props: SCExplorerType) => {
  const { children, className } = props;
  usePrepareSCState(props);

  return (
    <div className={classNames('mx-sdk-sc', className)}>
      {children ? children : <Layout {...props} />}
    </div>
  );
});
