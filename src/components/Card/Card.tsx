import React from 'react';
import classNames from 'classnames';

import { Badge } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';

import { CardUIType } from './types';

export const CardComponent = (props: CardUIType) => {
  const { title, children, className, titleContent, globalStyles } = props;
  const { customClassNames } = useSCExplorerContext();
  return (
    <div
      className={classNames(
        className,
        globalStyles?.card,
        globalStyles?.listItem,
        customClassNames?.cardClassName,
        customClassNames?.listItemClassName
      )}
    >
      {(titleContent || title) && (
        <div
          className={classNames(
            globalStyles?.cardHeader,
            customClassNames?.cardHeaderClassName
          )}
        >
          {titleContent ? (
            titleContent
          ) : (
            <span className={classNames(globalStyles?.cardHeaderTitle)}>
              {title}
            </span>
          )}
          <Badge {...props} />
        </div>
      )}
      {children && (
        <div
          className={classNames(
            globalStyles?.cardBody,
            customClassNames?.cardBodyClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const Card = withStyles(CardComponent, {});
