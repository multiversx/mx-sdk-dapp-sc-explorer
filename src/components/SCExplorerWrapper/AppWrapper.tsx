import React, { memo } from 'react';

import { Layout } from 'components';
import { usePrepareSCState } from 'hooks';
import { SCExplorerType } from 'types';

export const AppWrapper = memo((props: SCExplorerType) => {
  const { children } = props;
  usePrepareSCState(props);

  return (
    <div className='mx-sdk-sc'>
      {children ? children : <Layout {...props} />}
    </div>
  );
});
