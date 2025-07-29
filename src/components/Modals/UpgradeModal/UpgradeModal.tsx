import React, { useState } from 'react';

import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getUpgradeTransaction, sendAndTrackTransactions } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { useTrackTransaction } from 'hooks';
import { refreshAccount } from 'lib';
import {
  UserActionDispatchTypeEnum,
  DeployUpgradeModalInitialValuesType
} from 'types';

import { Modal } from '../Modal';

export const UpgradeModalComponent = ({ styles }: WithStylesImportType) => {
  const userActionDispatch = useUserActionDispatch();
  const { accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { upgradeModalState } = userActionsState;
  const { upgradeModalOpen = false, args, code } = upgradeModalState ?? {};
  const { isLoggedIn, address: callerAddress } = accountInfo;
  const { abiRegistry, contractAddress, deployedContractDetails } =
    smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const { status, transactions } = useTrackTransaction(sessionId);

  const onClose = () => {
    setIsLoading(false);
    setGeneralError(undefined);
    setSessionId(undefined);
    userActionDispatch({
      type: UserActionDispatchTypeEnum.setUpgradeModalState,
      upgradeModalState: {
        upgradeModalOpen: false,
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
      if (code && contractAddress && deployedContractDetails) {
        const transaction = getUpgradeTransaction({
          callerAddress,
          contractAddress,
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
          throw new Error('Unable to build Upgrade Transaction');
        }

        await refreshAccount();
        try {
          const upgradeSessionId = await sendAndTrackTransactions({
            transactions: [transaction],
            options: {
              transactionsDisplayInfo: {
                processingMessage: 'Upgrading Smart Contract',
                errorMessage:
                  'An error has occured during Smart Contract Upgrade',
                successMessage: 'Upgrade successful'
              }
            }
          });
          if (upgradeSessionId) {
            setSessionId(upgradeSessionId);
          }
        } catch (error) {
          if (typeof error === 'string' || error instanceof String) {
            setGeneralError(String(error));
          }
        }
      } else {
        setGeneralError(
          'Smart Contract Address is required and the Contract must be Deployed on the current Network'
        );
      }
    } catch (error) {
      console.error('Upgrade Smart Contract Error:', error);
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
      show={upgradeModalOpen}
      onClose={onClose}
      className={styles?.UpgradeModal}
      title='Upgrade Smart Contract'
    >
      {sessionId ? (
        <TransactionPanel
          onClose={onClose}
          transactions={transactions}
          status={status}
          panelDescription='Smart Contract Successfully Upgraded'
          panelErrorDescription='Could not Upgrade Smart Contract'
        />
      ) : (
        <InteractionModalForm
          isUpgrade={true}
          onSubmit={onSubmit}
          generalError={generalError}
          isLoading={isLoading}
          panelDescription={
            <>
              You are about to Upgrade a Smart Contract. <br />
              Please make sure that the entered data is valid !
            </>
          }
          buttonText='Upgrade Smart Contract'
        />
      )}
    </Modal>
  );
};

export const UpgradeModal = withStyles(UpgradeModalComponent, {
  ssrStyles: () => import('components/Modals/UpgradeModal/styles.module.scss'),
  clientStyles: () =>
    require('components/Modals/UpgradeModal/styles.module.scss').default
});
