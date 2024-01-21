import React, { useEffect, useState } from 'react';
import {
  faCircleNotch,
  faCogs,
  faCopy,
  faCircleCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransactionServerStatusesEnum } from '@multiversx/sdk-dapp/types/enums.types';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import { TransactionEvent } from '@multiversx/sdk-network-providers/out/transactionEvents';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CardItem } from 'components';
import { useSCExplorerContext } from 'contexts';
import { useGetTransaction, useUpdateDeployedContractDetails } from 'hooks';
import { TransactionPanelUIType, TransactionEventIdentifierEnum } from 'types';
import styles from './styles.module.scss';

export const TransactionPanel = ({
  onClose,
  status,
  transactions,
  panelDescription,
  panelErrorDescription
}: TransactionPanelUIType) => {
  const { customClassNames, icons } = useSCExplorerContext();
  const { loadIcon = faCircleNotch, copyIcon = faCopy } = icons ?? {};

  const getTransaction = useGetTransaction();
  const { updateDeployedContractDetails, isContractAddressCheckLoading } =
    useUpdateDeployedContractDetails();

  const [isTxStatusLoading, setIsTxStatusLoading] = useState(false);
  const [deployedContractAddress, setDeployedContractAddress] = useState('');

  // TODO - interpret Tx tvents
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionEvents, setTransactionEvents] =
    useState<TransactionEvent[]>();

  const getTransactionDetails = async () => {
    if (status) {
      setIsTxStatusLoading(true);
    }
    if (
      status === TransactionServerStatusesEnum.success &&
      transactions &&
      transactions.length > 0
    ) {
      const { hash } = transactions[0];
      if (hash) {
        const transaction = await getTransaction({ hash });
        if (transaction) {
          const transactionEvents = transaction?.logs?.events;
          if (transactionEvents) {
            setTransactionEvents(transactionEvents);
            const scDeployEvent = transactionEvents.find(
              (event) =>
                event?.identifier === TransactionEventIdentifierEnum.SCDeploy
            );
            const deployAddress = scDeployEvent?.address?.bech32();
            if (deployAddress) {
              setDeployedContractAddress(deployAddress);
              await updateDeployedContractDetails({
                address: deployAddress
              });
            }
          }
        }
      }
    }
    setIsTxStatusLoading(false);
  };

  useEffect(() => {
    getTransactionDetails();
  }, [status, transactions]);

  const isLoading =
    isTxStatusLoading || isContractAddressCheckLoading || !status;
  const isFailed =
    status &&
    [
      TransactionServerStatusesEnum.fail,
      TransactionServerStatusesEnum.invalid,
      TransactionServerStatusesEnum.notExecuted,
      TransactionServerStatusesEnum.rewardReverted
    ].includes(status as TransactionServerStatusesEnum);

  return (
    <div className={classNames(styles?.transactionPanel)}>
      <div className={classNames(globalStyles?.formPanel)}>
        {status === TransactionServerStatusesEnum.success &&
        !(isTxStatusLoading || isContractAddressCheckLoading) ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            size='2x'
            className={classNames(
              globalStyles?.formPanelIcon,
              globalStyles?.formPanelIconSuccess
            )}
          />
        ) : isFailed ? (
          <FontAwesomeIcon
            icon={faTimes}
            size='2x'
            className={classNames(
              globalStyles?.formPanelIcon,
              globalStyles?.formPanelIconFail
            )}
          />
        ) : (
          <FontAwesomeIcon
            icon={loadIcon}
            size='2x'
            className={classNames(
              'fa-spin',
              'fast-spin',
              globalStyles?.formPanelIcon,
              globalStyles?.formPanelIconLoading
            )}
          />
        )}
        {!isLoading &&
          (status === TransactionServerStatusesEnum.success ||
            isFailed ||
            deployedContractAddress) && (
            <div className={classNames(globalStyles?.formPanelText)}>
              {status === TransactionServerStatusesEnum.success
                ? panelDescription
                : ''}
              {isFailed ? panelErrorDescription : ''}
              {deployedContractAddress && (
                <div
                  className={classNames(
                    globalStyles?.cardContainer,
                    globalStyles?.cardItemContainer,
                    customClassNames?.cardItemContainerClassName,
                    styles?.transactionPanelCardContainer
                  )}
                >
                  <CardItem title='Contract Address' icon={faCogs}>
                    <Trim text={deployedContractAddress} />
                    <CopyButton
                      text={deployedContractAddress}
                      copyIcon={copyIcon}
                    />
                  </CardItem>
                </div>
              )}
            </div>
          )}
      </div>
      <button
        className={classNames(
          globalStyles?.button,
          globalStyles?.buttonPrimary,
          globalStyles?.buttonAction,
          customClassNames?.buttonClassName,
          customClassNames?.buttonPrimaryClassName,
          styles?.transactionPanelButton
        )}
        type='button'
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};
