import React, { useState } from 'react';
import { NativeSerializer, Code } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { Card, DocsPanel, PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractDeployForm } from './components';
import styles from './styles.module.scss';

export const ContractDeploy = () => {
  const { smartContract, customClassNames } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async ({
    values,
    wasmFileContent
  }: {
    values: any[];
    wasmFileContent: Code;
  }) => {
    setError(undefined);
    setIsLoading(true);
    try {
      const args = abiRegistry?.constructorDefinition
        ? NativeSerializer.nativeToTypedValues(
            values || [],
            abiRegistry.constructorDefinition
          )
        : [];

      console.log('-------values', values, args, wasmFileContent);
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
      return;
    }
  };

  return (
    <div
      className={classNames(
        styles?.contractDeploy,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader>Contract Deploy</PanelHeader>
      <Card>
        <DocsPanel />
        <ContractDeployForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          generalError={error}
        />
      </Card>
    </div>
  );
};
