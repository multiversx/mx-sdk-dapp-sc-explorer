import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useScContext } from 'context';

import { ContractEndpoint } from './ContractEndpoint';
import styles from './styles.module.scss';
import { ContractEndpointsUIType } from './types';

export const ContractEndpoints = ({
  mutability,
  customInterface
}: ContractEndpointsUIType) => {
  const { abiRegistry } = useScContext();
  const endpoints = abiRegistry?.endpoints;

  if (!(endpoints && endpoints.length > 0)) {
    return null;
  }

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
        globalStyles?.wrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <div
        className={classNames(
          styles.contractEndpointsList,
          globalStyles.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {filteredEndpoints.map((endpoint, index) => (
          <ContractEndpoint
            endpoint={endpoint}
            key={`${endpoint.name}-${index}`}
            className={classNames(
              globalStyles.listItem,
              styles.contractEndpointsListItem,
              customInterface?.customClassNames?.listItemClassName
            )}
            customInterface={customInterface}
          />
        ))}
      </div>
    </div>
  );
};
