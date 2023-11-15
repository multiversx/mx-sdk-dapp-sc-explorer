import React, { useState } from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer, Code } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  Card,
  DeployUpgradeFileForm,
  DocsPanel,
  PanelHeader,
  UpgradeModal
} from 'components';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { UserActionDispatchTypeEnum } from 'types';
import styles from './styles.module.scss';

export const ContractUpgrade = () => {
  const userActionDispatch = useUserActionDispatch();
  const { smartContract, customClassNames } = useSCExplorerContext();
  const { abiRegistry, contractAddress, deployedContractDetails } =
    smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = ({
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
        type: UserActionDispatchTypeEnum.setUpgradeModalState,
        upgradeModalState: {
          upgradeModalOpen: true,
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
      <PanelHeader>Contract Upgrade</PanelHeader>
      <Card>
        <DocsPanel />
        <DeployUpgradeFileForm
          isUpgrade={true}
          onSubmit={onSubmit}
          isLoading={isLoading}
          generalError={error}
          buttonText='Upgrade Contract'
          buttonLoginDescription='to upgrade a contract'
          buttonDescription={buttonDescription}
        />
      </Card>
    </div>
  );
};
