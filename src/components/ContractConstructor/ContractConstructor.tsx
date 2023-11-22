import React, { memo } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  Card,
  EndpointDefinitionList,
  PanelHeader,
  DocsPanel
} from 'components';
import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';

export const ContractConstructorComponent = () => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { hasConstructor } = support;

  if (!hasConstructor || !abiRegistry) {
    return null;
  }

  const { input, output } = abiRegistry?.constructorDefinition ?? {};

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
          <div className={classNames(globalStyles?.panel)}>
            <div className={classNames(globalStyles?.panelMode)}>Input</div>
            <div className={classNames(globalStyles?.panelContent)}>
              <EndpointDefinitionList definitions={input} />
            </div>
          </div>
        )}
        {output.length > 0 && (
          <div className={classNames(globalStyles?.panel)}>
            <div className={classNames(globalStyles?.panelMode)}>Input</div>
            <div className={classNames(globalStyles?.panelContent)}>
              <EndpointDefinitionList definitions={output} />
            </div>
          </div>
        )}
        <DocsPanel />
      </Card>
    </div>
  );
};

export const ContractConstructor = memo(ContractConstructorComponent);
