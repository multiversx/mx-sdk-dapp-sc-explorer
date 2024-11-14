import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { CardItemUIType } from './types';

export const CardItemComponent = ({
  title,
  icon,
  customIcon,
  children,
  styles
}: CardItemUIType) => {
  const { customClassNames } = useSCExplorerContext();
  return (
    <div
      className={classNames(
        styles?.cardItem,
        customClassNames?.cardItemClassName
      )}
    >
      {(icon || customIcon) && (
        <div
          className={classNames(
            styles?.cardItemIcon,
            customClassNames?.cardItemIconClassName
          )}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
          {customIcon}
        </div>
      )}
      <div className={classNames(styles?.cardItemContent)}>
        <div
          className={classNames(
            styles?.cardItemTitle,
            customClassNames?.cardItemTitleClassName
          )}
        >
          {title}
        </div>
        {children && (
          <div
            className={classNames(
              styles?.cardItemValue,
              customClassNames?.cardItemValueClassName
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardItem = withStyles(CardItemComponent, {
  ssrStyles: () => import('components/CardItem/styles.module.scss'),
  clientStyles: () => require('components/CardItem/styles.module.scss').default
});
