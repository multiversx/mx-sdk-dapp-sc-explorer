import React from 'react';
import classNames from 'classnames';

import { CollapsibleCard, EndpointTitle } from 'components';
import { useScContext } from 'context';
import { ContractEndpointMutabilityEnum } from 'types';

import { EndpointInteraction } from './components/EndpointInteraction';
import { EndpointMutate } from './components/EndpointMutate';
import { EndpointRead } from './components/EndpointRead';

import styles from '../styles.module.scss';
import { ContractEndpointUIType } from '../types';

export const ContractEndpoint = (props: ContractEndpointUIType) => {
  const { canRead, canMutate, canView } = useScContext();
  const { endpoint, className, customInterface } = props;
  const { modifiers } = endpoint;
  const { mutability } = modifiers;

  const allowRead =
    canRead && mutability === ContractEndpointMutabilityEnum.readonly;
  const allowMutate =
    canMutate && mutability === ContractEndpointMutabilityEnum.mutable;

  return (
    <CollapsibleCard
      {...props}
      title={endpoint.name}
      titleContent={<EndpointTitle {...props} />}
      className={classNames(className)}
      customInterface={customInterface}
    >
      {allowRead && (
        <EndpointRead
          endpoint={endpoint}
          customInterface={customInterface}
          className={classNames(styles?.contractEndpointWrapper)}
        />
      )}
      {allowMutate && (
        <EndpointMutate
          endpoint={endpoint}
          customInterface={customInterface}
          className={classNames(styles?.contractEndpointWrapper)}
        />
      )}
      {canView && !allowRead && !allowMutate && (
        <div className={classNames(styles?.contractEndpointWrapper)}>
          <EndpointInteraction
            endpoint={endpoint}
            customInterface={customInterface}
          />
        </div>
      )}
    </CollapsibleCard>
  );
};
