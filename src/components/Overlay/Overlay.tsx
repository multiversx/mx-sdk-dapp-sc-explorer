import React from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/Overlay';

import { OverlayUIType } from './types';

export const Overlay = ({
  children,
  title,
  className,
  tooltipClassName
}: OverlayUIType) => (
  <OverlayTrigger
    placement='top'
    delay={{ show: 0, hide: 400 }}
    overlay={(props: OverlayInjectedProps) => (
      <Tooltip
        {...props}
        className={classNames(tooltipClassName)}
        show={props.show}
      >
        {title}
      </Tooltip>
    )}
  >
    <div className={classNames(className)}>{children}</div>
  </OverlayTrigger>
);
