import React from 'react';
import {
  faUserCheck,
  faSquarePen,
  faSquareMinus,
  faCode,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { Badge, DocsTooltip } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { ContractEndpointMutabilityEnum, ContractEndpointUIType } from 'types';

export const EndpointTitleComponent = (props: ContractEndpointUIType) => {
  const { smartContract, customClassNames, icons } = useSCExplorerContext();
  const { rawAbi } = smartContract;
  const { endpoint, globalStyles } = props;
  const {
    mutableEndpointIcon = faSquarePen,
    readonlyEndpointIcon = faSquareMinus,
    onlyOwnerEndpointIcon = faUserCheck,
    interactiveEndpointIcon = faCode,
    payableEndpointIcon = faReceipt
  } = icons ?? {};
  const { input, output, modifiers } = endpoint;
  const { mutability } = modifiers;

  const rawAbiEndpoint = rawAbi?.endpoints?.find(
    (searchedInput) => searchedInput.name === endpoint?.name
  );

  return (
    <>
      <span className={classNames(globalStyles?.cardHeaderTitle)}>
        {endpoint?.name}
      </span>
      {mutability === ContractEndpointMutabilityEnum.mutable && (
        <Badge
          badgeValue='Write'
          badgeIcon={mutableEndpointIcon}
          className={classNames(customClassNames?.badgeSecondaryClassName)}
        />
      )}
      {mutability === ContractEndpointMutabilityEnum.readonly && (
        <Badge
          badgeValue='View'
          badgeIcon={readonlyEndpointIcon}
          className={classNames(customClassNames?.badgeSecondaryClassName)}
        />
      )}
      {modifiers?.isPayable() && (
        <Badge
          badgeValue='Payable'
          badgeIcon={payableEndpointIcon}
          className={classNames(customClassNames?.badgeSecondaryClassName)}
        />
      )}
      {Boolean(rawAbiEndpoint?.onlyOwner) && (
        <Badge
          badgeValue='Only Owner'
          badgeIcon={onlyOwnerEndpointIcon}
          className={classNames(customClassNames?.badgePrimaryClassName)}
        />
      )}
      {((mutability === ContractEndpointMutabilityEnum.mutable &&
        input.length > 0) ||
        (mutability === ContractEndpointMutabilityEnum.readonly &&
          output.length > 0)) && (
        <Badge
          badgeValue='Interactive'
          badgeIcon={interactiveEndpointIcon}
          className={classNames(customClassNames?.badgePrimaryClassName)}
        />
      )}
      {endpoint?.name && rawAbiEndpoint?.docs && (
        <DocsTooltip
          docs={rawAbiEndpoint.docs}
          className={globalStyles?.tooltipIcon}
        />
      )}
    </>
  );
};

export const EndpointTitle = withStyles(EndpointTitleComponent, {});
