import React, { useState } from 'react';
import {
  Address,
  SmartContract,
  CodeMetadata,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { DeployUpgradeModalForm } from 'components';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import {
  UserActionDispatchTypeEnum,
  DeployUpgradeModalInitialValuesType
} from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export const DeployModal = () => {
  const userActionDispatch = useUserActionDispatch();
  const { networkConfig, accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { environment } = networkConfig;
  const { deployModalState } = userActionsState;
  const { deployModalOpen = false, args, code } = deployModalState ?? {};
  const { isLoggedIn, address: callerAddress } = accountInfo;
  const { abiRegistry } = smartContract;
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();

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
      const { upgradeable, readable, payable, payableBySc } = values;
      const caller = new Address(callerAddress);
      const contract = new SmartContract({
        abi: abiRegistry
      });

      if (code) {
        const codeMetadata = new CodeMetadata(
          upgradeable,
          readable,
          payable,
          payableBySc
        );
        const transaction = contract.deploy({
          deployer: caller,
          code,
          codeMetadata,
          gasLimit: Number(values.gasLimit),
          initArguments: args,
          value: TokenTransfer.egldFromAmount(0),
          chainID: getChainID()
        });

        console.log('Transaction: ', transaction?.toPlainObject());

        // TODO - temporary - don't send the transactions for now - show them in console on mainnet
        const { error, sessionId: deploySessionId } = await sendTransactions({
          ...(environment === 'mainnet' ? { signWithoutSending: true } : {}),
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
      <DeployUpgradeModalForm
        onSubmit={onSubmit}
        onClose={onClose}
        generalError={generalError}
        isLoading={isLoading}
        panelDescription={
          <>
            You are about to deploy a new Smart Contract. <br />
            Please make sure that the entered data is valid !
          </>
        }
        buttonText='Deploy Smart Contract'
        successText='Smart Contract Successfully Deployed'
        sessionId={sessionId}
      />
    </Modal>
  );
};
