import React, { useState } from 'react';
import classNames from 'classnames';

import { Card, PanelHeader, MutateModal } from 'components';
import { CONTRACT_WRITE_ENDPOINT_HIDE_LIST } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { ContractEndpointMutabilityEnum } from 'types';

import { ContractEndpoint } from './ContractEndpoint';
import { EndpointTitle } from './ContractEndpoint/components/EndpointTitle';
import { ContractEndpointsUIType } from './types';

export const ContractEndpointsComponent = ({
  mutability,
  globalStyles,
  styles
}: ContractEndpointsUIType) => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { hasEndpoints, canMutate, canView } = support;
  const [allExpanded, setAllExpanded] = useState(false);

  if (!hasEndpoints) {
    return null;
  }

  const endpoints = abiRegistry?.endpoints ?? [];
  let filteredEndpoints = endpoints;
  if (mutability) {
    filteredEndpoints = endpoints.filter(
      (endpoint) =>
        endpoint?.modifiers?.mutability === mutability &&
        !(
          endpoint?.modifiers?.mutability ===
            ContractEndpointMutabilityEnum.mutable &&
          CONTRACT_WRITE_ENDPOINT_HIDE_LIST.includes(endpoint?.name)
        )
    );
  }

  if (filteredEndpoints.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles?.contractEndpoints,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      {mutability === ContractEndpointMutabilityEnum.mutable && canMutate && (
        <MutateModal />
      )}
      <PanelHeader
        showButtons={filteredEndpoints.length > 1}
        onAllExpanded={setAllExpanded}
      >
        {mutability === ContractEndpointMutabilityEnum.mutable && <>Write</>}
        {mutability === ContractEndpointMutabilityEnum.readonly && (
          <>Read</>
        )}{' '}
        Endpoints
      </PanelHeader>
      <div
        className={classNames(
          styles?.contractEndpointsList,
          globalStyles?.list,
          customClassNames?.listClassName
        )}
      >
        {filteredEndpoints.map((endpoint, index) => {
          if (canView) {
            return (
              <ContractEndpoint
                endpoint={endpoint}
                key={`${endpoint.name}-${index}`}
                className={classNames(
                  globalStyles?.listItem,
                  styles?.contractEndpointsListItem,
                  customClassNames?.listItemClassName
                )}
                isOpen={filteredEndpoints.length === 1 || allExpanded}
              />
            );
          } else {
            return (
              <Card
                key={`${endpoint.name}-${index}`}
                titleContent={
                  <EndpointTitle
                    endpoint={endpoint}
                    className={classNames(styles?.contractEndpointsListItem)}
                  />
                }
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export const ContractEndpoints = withStyles(ContractEndpointsComponent, {
  ssrStyles: () => import('components/ContractEndpoints/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractEndpoints/styles.module.scss').default
});
