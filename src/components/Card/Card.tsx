import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { Badge } from 'components';

import { CardUIType } from './types';

export const Card = (props: CardUIType) => {
  const { title, children, className, customInterface, titleContent } = props;
  return (
    <div
      className={classNames(
        className,
        globalStyles.card,
        customInterface?.customClassNames?.cardClassName,
        globalStyles.listItem,
        customInterface?.customClassNames?.listItemClassName
      )}
    >
      {(titleContent || title) && (
        <div
          className={classNames(
            globalStyles.cardHeader,
            customInterface?.customClassNames?.cardHeaderClassName
          )}
        >
          {titleContent ? (
            titleContent
          ) : (
            <span className={classNames(globalStyles.cardHeaderTitle)}>
              {title}
            </span>
          )}
          <Badge {...props} />
        </div>
      )}
      {children && (
        <div
          className={classNames(
            globalStyles.cardBody,
            customInterface?.customClassNames?.cardBodyClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
