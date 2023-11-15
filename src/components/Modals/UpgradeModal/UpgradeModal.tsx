import React, { useState } from 'react';
import {
  Address,
  SmartContract,
  CodeMetadata,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import {
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { useTrackTransaction } from 'hooks';
import {
  UserActionDispatchTypeEnum,
  DeployUpgradeModalInitialValuesType
} from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export const UpgradeModal = () => {
  const userActionDispatch = useUserActionDispatch();
  const { networkConfig, accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { environment } = networkConfig;
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
      const { upgradeable, readable, payable, payableBySc } = values;
      if (code && contractAddress && deployedContractDetails) {
        removeAllSignedTransactions();
        removeAllTransactionsToSign();
        const caller = new Address(callerAddress);
        const address = new Address(contractAddress);
        const contract = new SmartContract({
          abi: abiRegistry,
          address
        });
        const codeMetadata = new CodeMetadata(
          upgradeable,
          readable,
          payable,
          payableBySc
        );
        const transaction = contract.upgrade({
          caller,
          code,
          codeMetadata,
          gasLimit: Number(values.gasLimit),
          initArguments: args,
          value: TokenTransfer.egldFromAmount(0),
          chainID: getChainID()
        });

        if (environment === 'mainnet') {
          console.log('Transaction: ', transaction?.toPlainObject());
        }
        await refreshAccount();
        // TODO - temporary - don't send the transactions for now - show them in console on mainnet
        const { error, sessionId: upgradeSessionId } = await sendTransactions({
          ...(environment === 'mainnet' ? { signWithoutSending: true } : {}),
          transactions: [transaction],
          transactionsDisplayInfo: {
            processingMessage: 'Upgrading Smart Contract',
            errorMessage: 'An error has occured during Smart Contract Upgrade',
            successMessage: 'Upgrade successful'
          }
        });
        if (upgradeSessionId) {
          setSessionId(upgradeSessionId);
        }
        if (error) {
          setGeneralError(String(error));
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
