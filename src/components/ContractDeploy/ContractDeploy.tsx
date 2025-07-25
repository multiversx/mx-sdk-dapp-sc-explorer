import React, { useState } from 'react';
import { NativeSerializer, ICode } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import {
  Card,
  DeployUpgradeFileForm,
  DocsPanel,
  PanelHeader,
  DeployModal
} from 'components';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { getDefinition } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { UserActionDispatchTypeEnum } from 'types';

export const ContractDeployComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  const userActionDispatch = useUserActionDispatch();
  const { smartContract, customClassNames } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const deployDefinition = getDefinition({ abiRegistry, isUpgrade: false });

  const onSubmit = ({
    values,
    wasmFileContent
  }: {
    values: any[];
    wasmFileContent: ICode;
  }) => {
    setError(undefined);
    setIsLoading(true);
    try {
      const args = deployDefinition
        ? NativeSerializer.nativeToTypedValues(values || [], deployDefinition)
        : [];
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setDeployModalState,
        deployModalState: {
          deployModalOpen: true,
          args,
          code: wasmFileContent,
          endpoint: deployDefinition
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
      <PanelHeader>Deploy Contract</PanelHeader>
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

export const ContractDeploy = withStyles(ContractDeployComponent, {
  ssrStyles: () => import('components/ContractDeploy/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractDeploy/styles.module.scss').default
});
