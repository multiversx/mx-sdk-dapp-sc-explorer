import React from 'react';
import classNames from 'classnames';

import { CollapsibleCard } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractEndpointMutabilityEnum, ContractEndpointUIType } from 'types';
import { EndpointInteraction } from './components/EndpointInteraction';
import { EndpointMutate } from './components/EndpointMutate';
import { EndpointRead } from './components/EndpointRead';
import { EndpointTitle } from './components/EndpointTitle';
import styles from './styles.module.scss';

export const ContractEndpoint = (props: ContractEndpointUIType) => {
  const { support } = useSCExplorerContext();
  const { canRead, canMutate, canView } = support;
  const { endpoint, className } = props;
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
    >
      {allowRead && (
        <EndpointRead
          endpoint={endpoint}
          className={classNames(styles?.contractEndpointWrapper)}
        />
      )}
      {allowMutate && (
        <EndpointMutate
          endpoint={endpoint}
          className={classNames(styles?.contractEndpointWrapper)}
        />
      )}
      {canView && !allowRead && !allowMutate && (
        <div className={classNames(styles?.contractEndpointWrapper)}>
          <EndpointInteraction endpoint={endpoint} />
        </div>
      )}
    </CollapsibleCard>
  );
};
