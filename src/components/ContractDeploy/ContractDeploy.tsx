import React, { useState } from 'react';
import { NativeSerializer, Code } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  Card,
  DeployUpgradeFileForm,
  DocsPanel,
  PanelHeader,
  DeployModal
} from 'components';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { UserActionDispatchTypeEnum } from 'types';
import styles from './styles.module.scss';

export const ContractDeploy = () => {
  const userActionDispatch = useUserActionDispatch();
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
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setDeployModalState,
        deployModalState: {
          deployModalOpen: true,
          args,
          code: wasmFileContent,
          endpoint: abiRegistry?.constructorDefinition
        }
      });
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
      <DeployModal />
      <PanelHeader>Contract Deploy</PanelHeader>
      <Card>
        <DocsPanel />
        <DeployUpgradeFileForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          generalError={error}
          buttonText='Deploy Contract'
          buttonLoginDescription='to deploy a contract'
        />
      </Card>
    </div>
  );
};
