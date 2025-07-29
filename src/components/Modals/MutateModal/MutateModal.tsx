import React, { useState } from 'react';
import { InteractionModalForm, TransactionPanel } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getCallContractTransaction, sendAndTrackTransactions } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { useTrackTransaction } from 'hooks';
import { refreshAccount } from 'lib';
import {
  UserActionDispatchTypeEnum,
  MutateModalInitialValuesType
} from 'types';

import { Modal } from '../Modal';

export const MutateModalComponent = ({ styles }: WithStylesImportType) => {
  const userActionDispatch = useUserActionDispatch();
  const { accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
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
        const contractTransaction = getCallContractTransaction({
          contractAddress,
          callerAddress,
          abiRegistry,
          func: endpoint?.name,
          args,
          userGasLimit: Number(gasLimit),
          tokens
        });

        if (!contractTransaction) {
          throw new Error(`Unable to build ${endpoint?.name} Transaction`);
        }

        await refreshAccount();
        try {
          const mutateSessionId = await sendAndTrackTransactions({
            transactions: [contractTransaction],
            options: {
              transactionsDisplayInfo: {
                processingMessage: `Processing ${endpoint?.name} Transaction`,
                errorMessage: `An error has occured during ${endpoint?.name} Transaction`,
                successMessage: `${endpoint?.name} Transaction successful`
              }
            }
          });
          if (mutateSessionId) {
            setSessionId(mutateSessionId);
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

export const MutateModal = withStyles(MutateModalComponent, {
  ssrStyles: () => import('components/Modals/MutateModal/styles.module.scss'),
  clientStyles: () =>
    require('components/Modals/MutateModal/styles.module.scss').default
});
