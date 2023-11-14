import React from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CollapsibleCard, EndpointInteraction } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractEndpointMutabilityEnum, ContractEndpointUIType } from 'types';
import { EndpointMutate } from './components/EndpointMutate';
import { EndpointRead } from './components/EndpointRead';
import { EndpointTitle } from './components/EndpointTitle';
import styles from '../styles.module.scss';

export const ContractEndpoint = (props: ContractEndpointUIType) => {
  const { support, smartContract } = useSCExplorerContext();
  const { canRead, canMutate, canView } = support;
  const { deployedContractDetails } = smartContract;
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
