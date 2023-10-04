import React, { useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { Card, EndpointTitle, PanelHeader } from 'components';
import { useScContext } from 'context';
import { useSupport } from 'hooks';
import { ContractEndpointMutabilityEnum } from 'types';

import { ContractEndpoint } from './ContractEndpoint';
import styles from './styles.module.scss';
import { ContractEndpointsUIType } from './types';

export const ContractEndpoints = ({
  mutability,
  customInterface
}: ContractEndpointsUIType) => {
  const { abiRegistry } = useScContext();
  const { hasEndpoints } = useSupport();
  const [allExpanded, setAllExpanded] = useState(false);

  if (!hasEndpoints) {
    return null;
  }

  const endpoints = abiRegistry?.endpoints ?? [];
  let filteredEndpoints = endpoints;
  if (mutability) {
    filteredEndpoints = endpoints.filter(
      (endpoint) => endpoint?.modifiers?.mutability === mutability
    );
  }

  if (filteredEndpoints.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.contractEndpoints,
        globalStyles?.panelWrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={filteredEndpoints.length > 1}
        onAllExpanded={setAllExpanded}
        customInterface={customInterface}
      >
        {mutability === ContractEndpointMutabilityEnum.mutable && <>Write</>}
        {mutability === ContractEndpointMutabilityEnum.readonly && (
          <>Read</>
        )}{' '}
        Endpoints
      </PanelHeader>
      <div
        className={classNames(
          styles.contractEndpointsList,
          globalStyles.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {filteredEndpoints.map((endpoint, index) => {
          const hasInteraction =
            (endpoint?.input && endpoint.input.length > 0) ||
            (endpoint?.output && endpoint.output.length > 0);

          if (hasInteraction) {
            return (
              <ContractEndpoint
                endpoint={endpoint}
                key={`${endpoint.name}-${index}`}
                className={classNames(
                  globalStyles.listItem,
                  styles.contractEndpointsListItem,
                  customInterface?.customClassNames?.listItemClassName
                )}
                customInterface={customInterface}
                isOpen={filteredEndpoints.length === 1 || allExpanded}
              />
            );
          } else {
            return (
              <Card
                key={`${endpoint.name}-${index}`}
                customInterface={customInterface}
                titleContent={
                  <EndpointTitle
                    endpoint={endpoint}
                    className={classNames(styles.contractEndpointsListItem)}
                    customInterface={customInterface}
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
