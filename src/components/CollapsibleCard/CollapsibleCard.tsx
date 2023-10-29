import React, { useState, useEffect } from 'react';
import { isWindowAvailable } from '@multiversx/sdk-dapp/utils/isWindowAvailable';
import classNames from 'classnames';
import { Collapse } from 'react-bootstrap';

import globalStyles from 'assets/styles/globals.module.scss';
import { Badge } from 'components';
import { useSCExplorerContext } from 'contexts';
import { CollapsibleArrows } from './CollapsibleArrows';
import styles from './styles.module.scss';
import type { CollapsibleCardUIType } from './types';

export const CollapsibleCard = (props: CollapsibleCardUIType) => {
  const {
    isOpen = false,
    title = 'default',
    titleContent,
    children,
    className
  } = props;
  const { customClassNames } = useSCExplorerContext();
  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    if (isOpen !== open) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  // Fixes Trim re-render bug
  useEffect(() => {
    setTimeout(() => {
      if (isWindowAvailable()) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 0);
  }, [open]);

  return (
    <div
      className={classNames(
        styles?.collapsibleCard,
        globalStyles?.card,
        customClassNames?.cardClassName,
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
        <CollapsibleArrows
          expanded={open}
          className={classNames(globalStyles?.cardHeaderCollapseIcon)}
        />
      </div>
      <Collapse in={open}>
        <div id={title}>
          <div
            className={classNames(
              globalStyles?.cardBody,
              customClassNames?.cardBodyClassName
            )}
          >
            {children}
          </div>
        </div>
      </Collapse>
    </div>
  );
};
