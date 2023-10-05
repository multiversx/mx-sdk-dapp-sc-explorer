import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { BadgeUIType } from 'types';

export const Badge = ({
  badgeValue = '',
  badgeIcon,
  className,
  badgeClassName,
  customInterface
}: BadgeUIType) => {
  if (!badgeValue) {
    return null;
  }

  return (
    <span
      className={classNames(
        className,
        globalStyles?.badge,
        customInterface?.customClassNames?.badgeClassName,
        badgeClassName
      )}
    >
      {badgeIcon && (
        <FontAwesomeIcon
          icon={badgeIcon}
          className={classNames(
            globalStyles?.badgeIcon,
            customInterface?.customClassNames?.badgeIconClassName
          )}
        />
      )}
      {badgeValue}
    </span>
  );
};
