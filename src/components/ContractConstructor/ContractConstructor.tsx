import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { EndpointDefinitionList } from 'components';
import { useScContext } from 'context';

import styles from './styles.module.scss';
import { ContractConstructorUIType } from './types';

export const ContractConstructor = ({
  customInterface
}: ContractConstructorUIType) => {
  const { abiRegistry, rawAbi } = useScContext();

  if (!abiRegistry) {
    return null;
  }

  const { input, output } = abiRegistry?.constructorDefinition ?? {};
  const docs = rawAbi?.['constructor']?.docs ? rawAbi['constructor'].docs : [];

  return (
    <div
      className={classNames(
        styles.contractConstructor,
        globalStyles.card,
        customInterface?.customClassNames?.cardClassName,
        globalStyles.listItem,
        customInterface?.customClassNames?.listItemClassName
      )}
    >
      <div
        className={classNames(
          globalStyles.cardBody,
          customInterface?.customClassNames?.cardBodyClassName
        )}
      >
        {input.length > 0 && (
          <div
            className={classNames(styles.endpointOutput, globalStyles.panel)}
          >
            <div className={classNames(globalStyles.panelMode)}>Input</div>
            <div className={classNames(globalStyles.panelContent)}>
              <EndpointDefinitionList definitions={input} />
            </div>
          </div>
        )}
        {output.length > 0 && (
          <div
            className={classNames(styles.endpointOutput, globalStyles.panel)}
          >
            <div className={classNames(globalStyles.panelMode)}>Input</div>
            <div className={classNames(globalStyles.panelContent)}>
              <EndpointDefinitionList definitions={output} />
            </div>
          </div>
        )}
        {docs.length > 0 && (
          <div
            className={classNames(
              styles.endpointOutput,
              globalStyles.panel,
              styles.aboutPanel
            )}
          >
            <div className={classNames(globalStyles.panelMode)}>About</div>
            <div
              className={classNames(
                globalStyles.panelContent,
                styles.aboutPanelContent
              )}
            >
              {docs.map((string, key) => (
                <p key={key}>{string}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
