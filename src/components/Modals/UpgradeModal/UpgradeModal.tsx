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

export const UpgradeModal = () => {
  const userActionDispatch = useUserActionDispatch();
  const { networkConfig, accountInfo, smartContract, userActionsState } =
    useSCExplorerContext();
  const { environment } = networkConfig;
  const { upgradeModalState } = userActionsState;
  const { upgradeModalOpen = false, args, code } = upgradeModalState ?? {};
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
        const transaction = contract.upgrade({
          caller,
          code,
          codeMetadata,
          gasLimit: Number(values.gasLimit),
          initArguments: args,
          value: TokenTransfer.egldFromAmount(0),
          chainID: getChainID()
        });

        console.log('Transaction: ', transaction?.toPlainObject());

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
      <DeployUpgradeModalForm
        onClose={onClose}
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
        successText='Smart Contract Successfully Upgraded'
        sessionId={sessionId}
      />
    </Modal>
  );
};
