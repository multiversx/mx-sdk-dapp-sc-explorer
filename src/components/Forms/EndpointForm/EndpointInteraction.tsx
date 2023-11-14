import React from 'react';
import classNames from 'classnames';

import { InputList } from 'components';
import { EndpointInteractionUIType } from 'types';
import { EndpointOutput } from './EndpointOutput';
import styles from './styles.module.scss';

export const EndpointInteraction = ({
  endpoint,
  ...rest
}: EndpointInteractionUIType) => {
  const { input, output } = endpoint;

  return (
    <div className={classNames(styles?.endpointInteraction)}>
      <InputList input={input} endpoint={endpoint} {...rest} />
      <EndpointOutput output={output} {...rest} />
    </div>
  );
};
