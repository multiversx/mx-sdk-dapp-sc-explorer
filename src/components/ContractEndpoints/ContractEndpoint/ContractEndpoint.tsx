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

  return (
    <CollapsibleCard
      {...props}
      title={endpoint.name}
      titleContent={<EndpointTitle {...props} />}
      className={classNames(className)}
    >
      {canRead ? (
        <>
          {mutability === ContractEndpointMutabilityEnum.readonly && (
            <EndpointRead
              endpoint={endpoint}
              className={classNames(styles?.contractEndpointWrapper)}
            />
          )}
          {mutability === ContractEndpointMutabilityEnum.mutable && (
            <>
              {canMutate ? (
                <EndpointMutate
                  endpoint={endpoint}
                  className={classNames(styles?.contractEndpointWrapper)}
                />
              ) : (
                <div className={classNames(styles?.contractEndpointWrapper)}>
                  <EndpointInteraction endpoint={endpoint} />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {canView && (
            <div className={classNames(styles?.contractEndpointWrapper)}>
              <EndpointInteraction endpoint={endpoint} />
            </div>
          )}
        </>
      )}
    </CollapsibleCard>
  );
};
