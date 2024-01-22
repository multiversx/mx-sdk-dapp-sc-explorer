import React from 'react';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { Badge } from 'components';
import { useSCExplorerContext } from 'contexts';
import { PropertyPillUIType } from 'types';

export const PropertyPill = ({
  active,
  className,
  ...badgeProps
}: PropertyPillUIType) => {
  if (active === undefined) {
    return null;
  }
  const { customClassNames, icons } = useSCExplorerContext();
  const { checkIcon = faCheck, crossIcon = faClose } = icons ?? {};
  const badgeIcon = active ? checkIcon : crossIcon;
  const badgeClassName = active
    ? customClassNames?.badgeActiveClassName
    : customClassNames?.badgeInactiveClassName;

  return (
    <Badge
      {...badgeProps}
      badgeIcon={badgeIcon}
      className={classNames(className, badgeClassName)}
    />
  );
};
