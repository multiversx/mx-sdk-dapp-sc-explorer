import React from 'react';
import classNames from 'classnames';

import { InputList } from 'components';
import { withStyles } from 'hocs/withStyles';
import { EndpointInteractionUIType, DataTestIdsEnum } from 'types';

import { EndpointOutput } from './EndpointOutput';

export const EndpointInteractionComponent = ({
  endpoint,
  styles,
  ...rest
}: EndpointInteractionUIType) => {
  const { input, output } = endpoint;

  return (
    <div className={classNames(styles?.endpointInteraction)}>
      <InputList
        input={input}
        endpoint={endpoint}
        data-testid={DataTestIdsEnum.mutateFormInput}
        {...rest}
      />
      <EndpointOutput output={output} {...rest} />
    </div>
  );
};

export const EndpointInteraction = withStyles(EndpointInteractionComponent, {
  ssrStyles: () => import('components/Forms/EndpointForm/styles.module.scss'),
  clientStyles: () =>
    require('components/Forms/EndpointForm/styles.module.scss').default
});
