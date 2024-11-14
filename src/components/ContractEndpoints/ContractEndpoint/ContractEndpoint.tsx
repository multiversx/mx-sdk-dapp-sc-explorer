import React from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { CollapsibleCard, EndpointInteraction } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { ContractEndpointMutabilityEnum, ContractEndpointUIType } from 'types';

import { EndpointMutate } from './components/EndpointMutate';
import { EndpointRead } from './components/EndpointRead';
import { EndpointTitle } from './components/EndpointTitle';

export const ContractEndpointComponent = (props: ContractEndpointUIType) => {
  const { support, smartContract } = useSCExplorerContext();
  const { canRead, canMutate, canView } = support;
  const { deployedContractDetails } = smartContract;
  const { endpoint, className, globalStyles, styles } = props;
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
              <div
                className={classNames(
                  styles?.endpointActionWrapper,
                  globalStyles?.formActionWrapper
                )}
              >
                {!deployedContractDetails?.code && (
                  <div className={classNames(globalStyles?.formWarning)}>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className={classNames(globalStyles?.formWarningIcon)}
                    />
                    <span className={classNames(globalStyles?.formWarningText)}>
                      Smart Contract Address is required and the Contract must
                      be Deployed on the current Network in order to interact
                      with the Endpoints
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </CollapsibleCard>
  );
};

export const ContractEndpoint = withStyles(ContractEndpointComponent, {
  ssrStyles: () => import('components/ContractEndpoints/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractEndpoints/styles.module.scss').default
});
