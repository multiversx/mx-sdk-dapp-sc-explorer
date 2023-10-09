import React from 'react';
import classNames from 'classnames';

import { EndpointInteractionUIType } from 'types';

import { EndpointInputList } from './EndpointInputList';
import { EndpointOutput } from './EndpointOutput';
import styles from './styles.module.scss';

export const EndpointInteraction = ({
  endpoint,
  ...rest
}: EndpointInteractionUIType) => {
  const { input, output, modifiers } = endpoint;
  const { mutability } = modifiers;

  return (
    <div className={classNames(styles?.endpointInteraction)}>
      <EndpointInputList input={input} mutability={mutability} {...rest} />
      <EndpointOutput output={output} {...rest} />
    </div>
  );
};
