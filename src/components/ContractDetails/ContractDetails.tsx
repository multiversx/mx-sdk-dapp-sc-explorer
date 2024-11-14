import React, { memo } from 'react';
import {
  faAddressCard,
  faArrowUpRightFromSquare,
  faCopy,
  faClock,
  faDollarSign,
  faHandshake,
  faLayerGroup,
  faPassport,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { ExplorerLink } from '@multiversx/sdk-dapp/UI/ExplorerLink';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount';
import { TimeAgo } from '@multiversx/sdk-dapp/UI/TimeAgo';
import { ScAddressIcon } from '@multiversx/sdk-dapp/UI/TransactionsTable/components/ScAddressIcon';
import { ShardSpan } from '@multiversx/sdk-dapp/UI/TransactionsTable/components/ShardSpan';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import { explorerUrlBuilder } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction/helpers';
import { getHumanReadableTimeFormat } from '@multiversx/sdk-dapp/utils/transactions/getInterpretedTransaction/helpers/getHumanReadableTimeFormat';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import MultiversXSymbol from 'assets/img/symbol.svg';
import { CardItem, PanelHeader, PropertyPill } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { ContractPropertiesEnum } from 'types';

export const ContractDetailsComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  const { smartContract, support, icons, customClassNames } =
    useSCExplorerContext();
  const { deployedContractDetails } = smartContract;
  const { hasContractDetails } = support;

  const { copyIcon = faCopy } = icons ?? {};

  if (!hasContractDetails) {
    return null;
  }

  return (
    <div
      className={classNames(
        globalStyles?.wrapper,
        customClassNames?.wrapperClassName,
        styles?.contractDetails
      )}
    >
      <PanelHeader
        extraButtons={
          <ExplorerLink
            page={explorerUrlBuilder.accountDetails(
              deployedContractDetails?.address ?? ''
            )}
            className={classNames(
              globalStyles?.button,
              globalStyles?.buttonUnstyled,
              customClassNames?.buttonClassName
            )}
          >
            View in Explorer <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </ExplorerLink>
        }
      >
        Contract Details
      </PanelHeader>
      <div className={classNames(globalStyles?.cardBody)}>
        <div
          className={classNames(
            globalStyles?.cardContainer,
            globalStyles?.cardItemContainer,
            customClassNames?.cardItemContainerClassName
          )}
        >
          {deployedContractDetails?.address && (
            <CardItem title='Address' icon={faPassport}>
              <ScAddressIcon initiator={deployedContractDetails.address} />
              <Trim text={deployedContractDetails.address} />
              <CopyButton
                text={deployedContractDetails.address}
                copyIcon={copyIcon}
              />
            </CardItem>
          )}
          {deployedContractDetails?.assets?.name && (
            <CardItem title='Name' icon={faAddressCard}>
              {deployedContractDetails.assets.name}
            </CardItem>
          )}
          {deployedContractDetails?.balance !== undefined && (
            <CardItem title='Balance' customIcon={<MultiversXSymbol />}>
              <FormatAmount value={deployedContractDetails.balance} />
            </CardItem>
          )}
          {deployedContractDetails?.shard !== undefined && (
            <CardItem title='Shard' icon={faLayerGroup}>
              <ShardSpan shard={deployedContractDetails.shard} />
            </CardItem>
          )}
        </div>
        <div className={classNames(globalStyles?.cardContainer)}>
          <h6 className={classNames(globalStyles?.cardContainerTitle)}>
            Overview
          </h6>
          <div
            className={classNames(
              globalStyles?.cardItemContainer,
              customClassNames?.cardItemContainerClassName
            )}
          >
            {deployedContractDetails?.txCount !== undefined && (
              <CardItem title='Transactions' icon={faHandshake}>
                {new BigNumber(deployedContractDetails.txCount).toFormat()}
              </CardItem>
            )}
            {deployedContractDetails?.developerReward !== undefined && (
              <CardItem title='Rewards' icon={faDollarSign}>
                <FormatAmount value={deployedContractDetails.developerReward} />
              </CardItem>
            )}
            {deployedContractDetails?.ownerAddress && (
              <CardItem title='Owner' icon={faUser}>
                <ScAddressIcon
                  initiator={deployedContractDetails.ownerAddress}
                />
                <Trim text={deployedContractDetails.ownerAddress} />
                <CopyButton
                  text={deployedContractDetails.ownerAddress}
                  copyIcon={copyIcon}
                />
                <ExplorerLink
                  page={explorerUrlBuilder.accountDetails(
                    deployedContractDetails.ownerAddress
                  )}
                />
              </CardItem>
            )}
            {deployedContractDetails?.deployedAt && (
              <CardItem
                title='Deployed'
                icon={faClock}
                className={classNames(styles?.contractDetailsWrapContainer)}
              >
                <TimeAgo value={deployedContractDetails.deployedAt} />
                &nbsp;ago &nbsp;
                <span>
                  (
                  {getHumanReadableTimeFormat({
                    value: deployedContractDetails.deployedAt,
                    noSeconds: false,
                    utc: true
                  })}
                  )
                </span>
              </CardItem>
            )}
          </div>
        </div>
        <div className={classNames(globalStyles?.cardContainer)}>
          <h6 className={classNames(globalStyles?.cardContainerTitle)}>
            Properties
          </h6>
          <div
            className={classNames(
              globalStyles?.cardItemContainer,
              customClassNames?.cardItemContainerClassName
            )}
          >
            <div
              className={classNames(styles?.contractDetailsPropertiesContainer)}
            >
              <PropertyPill
                badgeValue={ContractPropertiesEnum.upgradeable}
                active={deployedContractDetails?.isUpgradeable}
              />
              <PropertyPill
                badgeValue={ContractPropertiesEnum.readable}
                active={deployedContractDetails?.isReadable}
              />
              <PropertyPill
                badgeValue={ContractPropertiesEnum.payable}
                active={deployedContractDetails?.isPayable}
              />
              <PropertyPill
                badgeValue={ContractPropertiesEnum.payableBySc}
                active={deployedContractDetails?.isPayableBySmartContract}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemoizedContractDetails = memo(ContractDetailsComponent);

export const ContractDetails = withStyles(MemoizedContractDetails, {
  ssrStyles: () => import('components/ContractDetails/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractDetails/styles.module.scss').default
});
