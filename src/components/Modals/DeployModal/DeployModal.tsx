import React, { useState } from 'react';
import {
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';

import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getDeployTransaction } from 'helpers';
import { useTrackTransaction } from 'hooks';
import {
  UserActionDispatchTypeEnum,
  DeployUpgradeModalInitialValuesType
} from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export const DeployModal = () => {
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
      removeAllSignedTransactions();
      removeAllTransactionsToSign();
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
          return;
        }
        await refreshAccount();
        const { error, sessionId: deploySessionId } = await sendTransactions({
          transactions: [transaction],
          transactionsDisplayInfo: {
            processingMessage: 'Deploying Smart Contract',
            errorMessage:
              'An error has occured during Smart Contract Deployment',
            successMessage: 'Deployment successful'
          }
        });
        if (deploySessionId) {
          setSessionId(deploySessionId);
        }
        if (error) {
          setGeneralError(String(error));
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
