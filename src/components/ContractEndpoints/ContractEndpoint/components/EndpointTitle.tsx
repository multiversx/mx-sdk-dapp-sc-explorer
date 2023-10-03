import React from 'react';
import {
  faUserCheck,
  faSquarePen,
  faSquareMinus,
  faCode,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { Badge, DocsTooltip } from 'components';
import { useScContext } from 'context';
import { ContractEndpointMutabilityEnum } from 'types';

import { ContractEndpointUIType } from '../../types';

export const EndpointTitle = (props: ContractEndpointUIType) => {
  const { rawAbi } = useScContext();
  const { endpoint, customInterface } = props;
  const {
    mutableEndpointIcon = faSquarePen,
    readonlyEndpointIcon = faSquareMinus,
    onlyOwnerEndpointIcon = faUserCheck,
    interactiveEndpointIcon = faCode,
    payableEndpointIcon = faReceipt
  } = customInterface?.icons ?? {};
  const { input, output, modifiers } = endpoint;
  const { mutability } = modifiers;

  const rawAbiEndpoint = rawAbi?.endpoints?.find(
    (searchedInput) => searchedInput.name === endpoint?.name
  );

  return (
    <>
      <span className={classNames(globalStyles.cardHeaderTitle)}>
        {endpoint?.name}
      </span>
      {mutability === ContractEndpointMutabilityEnum.mutable && (
        <Badge
          badgeValue='Write'
          badgeIcon={mutableEndpointIcon}
          className={classNames(
            customInterface?.customClassNames?.badgeSecondaryClassName
          )}
        />
      )}
      {mutability === ContractEndpointMutabilityEnum.readonly && (
        <Badge
          badgeValue='View'
          badgeIcon={readonlyEndpointIcon}
          className={classNames(
            customInterface?.customClassNames?.badgeSecondaryClassName
          )}
        />
      )}
      {modifiers?.isPayable() && (
        <Badge
          badgeValue='Payable'
          badgeIcon={payableEndpointIcon}
          className={classNames(
            customInterface?.customClassNames?.badgeSecondaryClassName
          )}
        />
      )}
      {Boolean(rawAbiEndpoint?.onlyOwner) && (
        <Badge
          badgeValue='Only Owner'
          badgeIcon={onlyOwnerEndpointIcon}
          className={classNames(
            customInterface?.customClassNames?.badgePrimaryClassName
          )}
        />
      )}
      {(input.length > 0 || output.length > 0) && (
        <Badge
          badgeValue='Interactive'
          badgeIcon={interactiveEndpointIcon}
          className={classNames(
            customInterface?.customClassNames?.badgePrimaryClassName
          )}
        />
      )}
      {endpoint?.name && rawAbiEndpoint?.docs && (
        <DocsTooltip docs={rawAbiEndpoint.docs} />
      )}
    </>
  );
};
