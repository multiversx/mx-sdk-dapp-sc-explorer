import React, { useState } from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer, ICode } from 'lib/sdkCore';
import classNames from 'classnames';

import {
  Card,
  DeployUpgradeFileForm,
  DocsPanel,
  PanelHeader,
  UpgradeModal
} from 'components';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { getDefinition } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { UserActionDispatchTypeEnum } from 'types';

export const ContractUpgradeComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  const userActionDispatch = useUserActionDispatch();
  const { smartContract, customClassNames, accountInfo } =
    useSCExplorerContext();
  const { abiRegistry, contractAddress, deployedContractDetails } =
    smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { isLoggedIn } = accountInfo;
  const upgradeDefinition = getDefinition({ abiRegistry, isUpgrade: true });

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
      const args = upgradeDefinition
        ? NativeSerializer.nativeToTypedValues(values || [], upgradeDefinition)
        : [];
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setUpgradeModalState,
        upgradeModalState: {
          upgradeModalOpen: true,
          args,
          code: wasmFileContent,
          endpoint: upgradeDefinition
        }
      });
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
      return;
    }
  };

  const buttonDescription =
    contractAddress && deployedContractDetails ? (
      ''
    ) : (
      <>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className={classNames(globalStyles?.formWarningIcon)}
        />
        Contract Address is required in order to upgrade a Smart Contract
      </>
    );

  return (
    <div
      className={classNames(
        styles?.contractUpgrade,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      <UpgradeModal />
      <PanelHeader>Upgrade Contract</PanelHeader>
      <Card>
        <DocsPanel />
        <DeployUpgradeFileForm
          isUpgrade={true}
          onSubmit={onSubmit}
          isLoading={isLoading}
          generalError={error}
          buttonText='Upgrade Contract'
          buttonLoginDescription='to upgrade a contract'
          buttonDescription={isLoggedIn ? buttonDescription : undefined}
        />
      </Card>
    </div>
  );
};

export const ContractUpgrade = withStyles(ContractUpgradeComponent, {
  ssrStyles: () => import('components/ContractUpgrade/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractUpgrade/styles.module.scss').default
});
