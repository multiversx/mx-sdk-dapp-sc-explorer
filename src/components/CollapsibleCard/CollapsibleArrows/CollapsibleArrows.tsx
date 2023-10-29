import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import type { CollapsibleArrowsUIType } from '../types';

export const CollapsibleArrows = ({
  expanded,
  className,
  size = 'sm'
}: CollapsibleArrowsUIType) => {
  const { icons } = useSCExplorerContext();
  const { expandedIcon = faChevronUp, collapsedIcon = faChevronDown } =
    icons ?? {};

  return (
    <FontAwesomeIcon
      className={classNames(className)}
      size={size}
      icon={expanded ? expandedIcon : collapsedIcon}
    />
  );
};
