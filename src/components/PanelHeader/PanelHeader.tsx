import React from 'react';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';

import { PanelHeaderUIType } from './types';

export const PanelHeaderComponent = ({
  children,
  showButtons = false,
  extraButtons = null,
  onAllExpanded,
  globalStyles,
  styles
}: PanelHeaderUIType) => {
  const { customClassNames } = useSCExplorerContext();
  return (
    <div className={classNames(styles?.panelHeader)}>
      {children && (
        <div className={classNames(styles?.panelHeaderTitle)}>{children}</div>
      )}
      {(showButtons || extraButtons) && (
        <div className={classNames(styles?.panelHeaderButtons)}>
          {showButtons && onAllExpanded !== undefined && (
            <>
              <button
                type='button'
                className={classNames(
                  globalStyles?.button,
                  globalStyles?.buttonUnstyled,
                  customClassNames?.buttonClassName
                )}
                onClick={() => {
                  onAllExpanded(true);
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
                  onAllExpanded(false);
                }}
              >
                Reset
              </button>
            </>
          )}
          {extraButtons}
        </div>
      )}
    </div>
  );
};

export const PanelHeader = withStyles(PanelHeaderComponent, {
  ssrStyles: () => import('components/PanelHeader/styles.module.scss'),
  clientStyles: () =>
    require('components/PanelHeader/styles.module.scss').default
});
