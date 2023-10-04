import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Collapse } from 'react-bootstrap';

import globalStyles from 'assets/styles/globals.module.scss';
import { Badge } from 'components';
import { CollapsibleArrows } from './CollapsibleArrows';

import styles from './styles.module.scss';
import type { CollapsibleCardUIType } from './types';

export const CollapsibleCard = (props: CollapsibleCardUIType) => {
  const {
    isOpen = false,
    title = 'default',
    titleContent,
    children,
    customInterface,
    className
  } = props;
  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    if (isOpen !== open) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <div
      className={classNames(
        styles?.collapsibleCard,
        globalStyles?.card,
        customInterface?.customClassNames?.cardClassName,
        className,
        { open }
      )}
    >
      <div
        onClick={() => setOpen(!open)}
        aria-controls={title}
        aria-expanded={open}
        className={classNames(
          globalStyles?.cardHeader,
          customInterface?.customClassNames?.cardHeaderClassName
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
        <CollapsibleArrows
          expanded={open}
          className={classNames(globalStyles?.cardHeaderCollapseIcon)}
        />
      </div>
      <Collapse in={open}>
        <div id={title}>
          <div
            className={classNames(
              globalStyles.cardBody,
              customInterface?.customClassNames?.cardBodyClassName
            )}
          >
            {children}
          </div>
        </div>
      </Collapse>
    </div>
  );
};
