import React, { useState } from 'react';
import {
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getCallContractTransaction } from 'helpers';
import { useTrackTransaction } from 'hooks';
import {
  UserActionDispatchTypeEnum,
  MutateModalInitialValuesType
} from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export const MutateModal = () => {
  const userActionDispatch = useUserActionDispatch();
  const { networkConfig, accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { environment } = networkConfig;
  const { mutateModalState } = userActionsState;
  const { mutateModalOpen = false, args, endpoint } = mutateModalState ?? {};
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
      type: UserActionDispatchTypeEnum.setMutateModalState,
      mutateModalState: {
        mutateModalOpen: false,
        endpoint: undefined,
        code: undefined,
        args: []
      }
    });
  };

  const onSubmit = async (values: MutateModalInitialValuesType) => {
    try {
      setIsLoading(true);
      setSessionId(undefined);
      const { tokens, gasLimit } = values;
      if (contractAddress && deployedContractDetails) {
        removeAllSignedTransactions();
        removeAllTransactionsToSign();
        const contractTransaction = getCallContractTransaction({
          contractAddress,
          callerAddress,
          abiRegistry,
          func: endpoint?.name,
          args,
          userGasLimit: Number(gasLimit),
          tokens
        });

        if (environment === 'mainnet') {
          console.log('Transaction: ', contractTransaction?.toPlainObject());
        }
        await refreshAccount();
        // TODO - temporary - don't send the transactions for now - show them in console on mainnet
        const { error, sessionId: mutateSessionId } = await sendTransactions({
          ...(environment === 'mainnet' ? { signWithoutSending: true } : {}),
          transactions: [contractTransaction],
          transactionsDisplayInfo: {
            processingMessage: `Processing ${endpoint?.name} Transaction`,
            errorMessage: `An error has occured during ${endpoint?.name} Transaction`,
            successMessage: `${endpoint?.name} Transaction successful`
          }
        });
        if (mutateSessionId) {
          setSessionId(mutateSessionId);
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
      console.error('Send Contract Mutation Error:', error);
      setGeneralError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!(isLoggedIn && endpoint && args)) {
    return null;
  }

  return (
    <Modal
      show={mutateModalOpen}
      onClose={onClose}
      className={styles?.mutateModal}
      title={`Setup ${endpoint?.name} Transaction`}
    >
      {sessionId ? (
        <TransactionPanel
          onClose={onClose}
          transactions={transactions}
          status={status}
          panelDescription={`${endpoint?.name} Transaction Sent`}
          panelErrorDescription={`An error occured during ${endpoint?.name} Transaction`}
        />
      ) : (
        <InteractionModalForm
          isMutate={true}
          onSubmit={onSubmit}
          generalError={generalError}
          isLoading={isLoading}
          panelDescription={
            <>
              This is a real transaction that will be executed on the Smart
              Contract. <br />
              Please make sure that the entered data is valid !
            </>
          }
          buttonText='Send Transaction'
        />
      )}
    </Modal>
  );
};
