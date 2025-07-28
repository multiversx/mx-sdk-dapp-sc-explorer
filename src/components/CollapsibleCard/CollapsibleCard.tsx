import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import { Collapse } from 'react-bootstrap';

import { Badge } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { isWindowAvailable } from 'lib';

import { CollapsibleArrows } from './CollapsibleArrows';
import type { CollapsibleCardUIType } from './types';

export const CollapsibleCardComponent = (props: CollapsibleCardUIType) => {
  const {
    isOpen = false,
    title = 'default',
    titleContent,
    children,
    className,
    globalStyles,
    styles
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

export const CollapsibleCard = withStyles(CollapsibleCardComponent, {
  ssrStyles: () => import('components/CollapsibleCard/styles.module.scss'),
  clientStyles: () =>
    require('components/CollapsibleCard/styles.module.scss').default
});
