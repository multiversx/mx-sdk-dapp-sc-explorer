import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { CardItemUIType } from './types';

export const CardItem = ({
  title,
  icon,
  children,
  customInterface
}: CardItemUIType) => (
  <div
    className={classNames(
      styles.cardItem,
      customInterface?.customClassNames?.cardItemClassName
    )}
  >
    {icon && (
      <div
        className={classNames(
          styles.cardItemIcon,
          customInterface?.customClassNames?.cardItemIconClassName
        )}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
    )}
    <div className={classNames(styles.cardItemContent)}>
      <div
        className={classNames(
          styles.cardItemTitle,
          customInterface?.customClassNames?.cardItemTitleClassName
        )}
      >
        {title}
      </div>
      {children && (
        <div
          className={classNames(
            styles.cardItemValue,
            customInterface?.customClassNames?.cardItemValueClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  </div>
);
