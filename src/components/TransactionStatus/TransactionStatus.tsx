import React, { useEffect, useState } from 'react';
import {
  faPlay,
  faCircleNotch,
  faCogs,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks/transactions/useTrackTransactionStatus';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import { TransactionEvent } from '@multiversx/sdk-network-providers/out/transactionEvents';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CardItem } from 'components';
import { useSCExplorerContext } from 'contexts';
import { useGetTransaction, useUpdateDeployedContractDetails } from 'hooks';
import { TransactionStatusUIType } from 'types';
import styles from './styles.module.scss';

export const TransactionStatus = ({
  onClose,
  sessionId = '0',
  isDisabled,
  isLoading,
  buttonText,
  successText
}: TransactionStatusUIType) => {
  const { accountInfo, customClassNames, icons } = useSCExplorerContext();
  const {
    playIcon = faPlay,
    loadIcon = faCircleNotch,
    copyIcon = faCopy
  } = icons ?? {};

  const { isLoggedIn } = accountInfo;
  const getTransaction = useGetTransaction();
  const { updateDeployedContractDetails, isContractAddressCheckLoading } =
    useUpdateDeployedContractDetails();

  const [txProcessingFinished, setTxProcessingFinished] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionEvents, setTransactionEvents] =
    useState<TransactionEvent[]>();

  const onTransactionStateChange = () => {
    setTxProcessingFinished(true);
  };

  const transactionStatus = useTrackTransactionStatus({
    onCancelled: onTransactionStateChange,
    onFail: onTransactionStateChange,
    onSuccess: onTransactionStateChange,
    onTimedOut: onTransactionStateChange,
    transactionId: sessionId
  });
  const { status, transactions } = transactionStatus;

  const getTransactionDetails = async () => {
    if (status === 'success' && transactions && transactions.length > 0) {
      const { hash } = transactions[0];
      if (hash) {
        const transaction = await getTransaction({ hash });
        if (transaction) {
          const transactionEvents = transaction?.logs?.events;
          if (transactionEvents) {
            setTransactionEvents(transactionEvents);
            const scDeployEvent = transactionEvents.find(
              (event) => event?.identifier === 'SCDeploy'
            );
            const deployAddress = scDeployEvent?.address?.bech32();
            if (deployAddress) {
              setContractAddress(deployAddress);
              await updateDeployedContractDetails({
                address: deployAddress
              });
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    getTransactionDetails();
  }, [status, transactions]);

  return (
    <div className={classNames(styles?.transactionStatus)}>
      {status === 'success' && successText && (
        <div className={classNames(styles?.transactionStatusText)}>
          {successText}
        </div>
      )}
      {contractAddress && (
        <div
          className={classNames(
            globalStyles?.cardContainer,
            globalStyles?.cardItemContainer,
            customClassNames?.cardItemContainerClassName,
            styles?.transactionStatusCardContainer
          )}
        >
          <CardItem title='Contract Address' icon={faCogs}>
            <Trim text={contractAddress} />
            <CopyButton
              text={contractAddress}
              copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
            />
          </CardItem>
        </div>
      )}
      {(txProcessingFinished && !isLoading && !isContractAddressCheckLoading) ||
      !isLoggedIn ? (
        <button
          className={classNames(
            globalStyles?.button,
            globalStyles?.buttonPrimary,
            globalStyles?.buttonAction,
            customClassNames?.buttonClassName,
            customClassNames?.buttonPrimaryClassName,
            styles?.transactionStatusButton
          )}
          type='button'
          onClick={onClose}
        >
          Close
        </button>
      ) : (
        <button
          className={classNames(
            globalStyles?.button,
            globalStyles?.buttonPrimary,
            globalStyles?.buttonAction,
            customClassNames?.buttonClassName,
            customClassNames?.buttonPrimaryClassName,
            styles?.transactionStatusButton
          )}
          type='submit'
          {...(isDisabled || isLoading || isContractAddressCheckLoading
            ? { disabled: true }
            : {})}
        >
          {buttonText}
          {isLoading || isContractAddressCheckLoading ? (
            <FontAwesomeIcon icon={loadIcon} className='fa-spin fast-spin' />
          ) : (
            <FontAwesomeIcon icon={playIcon} />
          )}
        </button>
      )}
    </div>
  );
};
