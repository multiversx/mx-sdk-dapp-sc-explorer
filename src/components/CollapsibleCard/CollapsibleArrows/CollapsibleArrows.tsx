import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import type { CollapsibleArrowsUIType } from '../types';

export const CollapsibleArrows = ({
  expanded,
  className,
  customInterface,
  size = 'sm'
}: CollapsibleArrowsUIType) => {
  const { expandedIcon = faChevronUp, collapsedIcon = faChevronDown } =
    customInterface?.icons ?? {};

  return (
    <FontAwesomeIcon
      className={classNames(className)}
      size={size}
      icon={expanded ? expandedIcon : collapsedIcon}
    />
  );
};
