import React, { useState } from 'react';

import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getDeployTransaction, sendAndTrackTransactions } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { useTrackTransaction } from 'hooks';
import { refreshAccount } from 'lib';
import {
  UserActionDispatchTypeEnum,
  DeployUpgradeModalInitialValuesType
} from 'types';

import { Modal } from '../Modal';

export const DeployModalComponent = ({ styles }: WithStylesImportType) => {
  const userActionDispatch = useUserActionDispatch();
  const { accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { deployModalState } = userActionsState;
  const { deployModalOpen = false, args, code } = deployModalState ?? {};
  const { isLoggedIn, address: callerAddress } = accountInfo;
  const { abiRegistry } = smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const { status, transactions } = useTrackTransaction(sessionId);

  const onClose = () => {
    setIsLoading(false);
    setGeneralError(undefined);
    setSessionId(undefined);
    userActionDispatch({
      type: UserActionDispatchTypeEnum.setDeployModalState,
      deployModalState: {
        deployModalOpen: false,
        endpoint: undefined,
        code: undefined,
        args: []
      }
    });
  };

  const onSubmit = async (values: DeployUpgradeModalInitialValuesType) => {
    try {
      setIsLoading(true);
      setSessionId(undefined);
      const { upgradeable, readable, payable, payableBySc, gasLimit } = values;

      if (code) {
        const transaction = getDeployTransaction({
          callerAddress,
          abiRegistry,
          args,
          userGasLimit: Number(gasLimit),
          code,
          metadata: {
            upgradeable,
            readable,
            payable,
            payableBySc
          }
        });

        if (!transaction) {
          throw new Error('Unable to build Deploy Transaction');
        }

        await refreshAccount();
        try {
          const deploySessionId = await sendAndTrackTransactions({
            transactions: [transaction],
            options: {
              transactionsDisplayInfo: {
                processingMessage: 'Deploying Smart Contract',
                errorMessage:
                  'An error has occured during Smart Contract Deployment',
                successMessage: 'Deployment successful'
              }
            }
          });
          if (deploySessionId) {
            setSessionId(deploySessionId);
          }
        } catch (error) {
          if (typeof error === 'string' || error instanceof String) {
            setGeneralError(String(error));
          }
        }
      } else {
        setGeneralError('Missing WASM Code');
      }
    } catch (error) {
      console.error('Deploy Smart Contract Error:', error);
      setGeneralError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!(isLoggedIn && code)) {
    return null;
  }

  return (
    <Modal
      show={deployModalOpen}
      onClose={onClose}
      className={styles?.deployModal}
      title='Deploy Smart Contract'
    >
      {sessionId ? (
        <TransactionPanel
          onClose={onClose}
          transactions={transactions}
          status={status}
          panelDescription='Smart Contract Successfully Deployed'
          panelErrorDescription='Could not Deploy Smart Contract'
        />
      ) : (
        <InteractionModalForm
          isDeploy={true}
          onSubmit={onSubmit}
          generalError={generalError}
          isLoading={isLoading}
          panelDescription={
            <>
              You are about to Deploy a new Smart Contract. <br />
              Please make sure that the entered data is valid !
            </>
          }
          buttonText='Deploy Smart Contract'
        />
      )}
    </Modal>
  );
};

export const DeployModal = withStyles(DeployModalComponent, {
  ssrStyles: () => import('components/Modals/DeployModal/styles.module.scss'),
  clientStyles: () =>
    require('components/Modals/DeployModal/styles.module.scss').default
});
