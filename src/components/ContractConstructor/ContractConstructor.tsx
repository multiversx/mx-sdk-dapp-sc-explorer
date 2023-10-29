import React, { memo } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { Card, EndpointDefinitionList, PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';

export const ContractConstructorComponent = () => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { abiRegistry, rawAbi } = smartContract;
  const { hasConstructor } = support;

  if (!hasConstructor || !abiRegistry) {
    return null;
  }

  const { input, output } = abiRegistry?.constructorDefinition ?? {};
  const docs = rawAbi?.['constructor']?.docs ? rawAbi['constructor'].docs : [];

  return (
    <div
      className={classNames(
        styles?.contractConstructor,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader>Constructor</PanelHeader>
      <Card>
        {input.length > 0 && (
          <div
            className={classNames(styles?.endpointOutput, globalStyles?.panel)}
          >
            <div className={classNames(globalStyles?.panelMode)}>Input</div>
            <div className={classNames(globalStyles?.panelContent)}>
              <EndpointDefinitionList definitions={input} />
            </div>
          </div>
        )}
        {output.length > 0 && (
          <div
            className={classNames(styles?.endpointOutput, globalStyles?.panel)}
          >
            <div className={classNames(globalStyles?.panelMode)}>Input</div>
            <div className={classNames(globalStyles?.panelContent)}>
              <EndpointDefinitionList definitions={output} />
            </div>
          </div>
        )}
        {docs.length > 0 && (
          <div
            className={classNames(
              styles?.endpointOutput,
              globalStyles?.panel,
              styles?.aboutPanel
            )}
          >
            <div className={classNames(globalStyles?.panelMode)}>About</div>
            <div
              className={classNames(
                globalStyles?.panelContent,
                styles?.aboutPanelContent
              )}
            >
              {docs.map((string, key) => (
                <p key={key}>{string}</p>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export const ContractConstructor = memo(ContractConstructorComponent);
