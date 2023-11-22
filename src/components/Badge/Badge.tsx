import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useSCExplorerContext } from 'contexts';
import { BadgeUIType } from 'types';

export const Badge = ({
  badgeValue = '',
  badgeIcon,
  className,
  badgeClassName
}: BadgeUIType) => {
  if (!badgeValue) {
    return null;
  }
  const { customClassNames } = useSCExplorerContext();

  return (
    <span
      className={classNames(
        className,
        globalStyles?.badge,
        customClassNames?.badgeClassName,
        badgeClassName
      )}
    >
      {badgeIcon && (
        <FontAwesomeIcon
          icon={badgeIcon}
          className={classNames(
            globalStyles?.badgeIcon,
            customClassNames?.badgeIconClassName
          )}
        />
      )}
      {badgeValue}
    </span>
  );
};
