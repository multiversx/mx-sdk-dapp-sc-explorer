import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { BadgeUIType } from 'types';

export const BadgeComponent = ({
  badgeValue = '',
  badgeIcon,
  className,
  badgeClassName,
  globalStyles
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

export const Badge = withStyles(BadgeComponent, {});
