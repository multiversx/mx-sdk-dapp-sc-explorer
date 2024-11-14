import React from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/Overlay';

import { withStyles } from 'hocs/withStyles';

import { OverlayUIType } from './types';

export const OverlayComponent = ({
  children,
  title,
  className,
  tooltipClassName,
  globalStyles
}: OverlayUIType) => (
  <OverlayTrigger
    placement='top'
    delay={{ show: 0, hide: 400 }}
    overlay={(props: OverlayInjectedProps) => (
      <Tooltip
        {...props}
        className={classNames(tooltipClassName, globalStyles?.tooltip)}
        show={props.show}
      >
        {title}
      </Tooltip>
    )}
  >
    <div className={classNames(className)}>{children}</div>
  </OverlayTrigger>
);

export const Overlay = withStyles(OverlayComponent, {});
