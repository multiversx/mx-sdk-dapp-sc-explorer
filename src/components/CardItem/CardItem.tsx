import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';
import { CardItemUIType } from './types';

export const CardItem = ({ title, icon, children }: CardItemUIType) => {
  const { customClassNames } = useSCExplorerContext();
  return (
    <div
      className={classNames(
        styles?.cardItem,
        customClassNames?.cardItemClassName
      )}
    >
      {icon && (
        <div
          className={classNames(
            styles?.cardItemIcon,
            customClassNames?.cardItemIconClassName
          )}
        >
          <FontAwesomeIcon icon={icon} />
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
