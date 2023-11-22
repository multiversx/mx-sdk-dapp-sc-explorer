import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';
import { PanelHeaderUIType } from './types';

export const PanelHeader = ({
  children,
  showButtons = false,
  onAllExpanded
}: PanelHeaderUIType) => {
  const { customClassNames } = useSCExplorerContext();
  return (
    <div className={classNames(styles?.panelHeader)}>
      {children && (
        <div className={classNames(styles?.panelHeaderTitle)}>{children}</div>
      )}
      {showButtons && (
        <div className={classNames(styles?.panelHeaderButtons)}>
          <button
            type='button'
            className={classNames(
              globalStyles?.button,
              globalStyles?.buttonUnstyled,
              customClassNames?.buttonClassName
            )}
            onClick={() => {
              if (onAllExpanded) {
                onAllExpanded(true);
              }
            }}
          >
            Expand All
          </button>
          <button
            type='button'
            className={classNames(
              globalStyles?.button,
              globalStyles?.buttonUnstyled,
              customClassNames?.buttonClassName
            )}
            onClick={() => {
              if (onAllExpanded) {
                onAllExpanded(false);
              }
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
