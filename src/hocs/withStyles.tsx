import React, { FunctionComponent } from 'react';

import defaultGlobalStyles from 'assets/styles/globals.module.scss';

export type WithStylesImportType = {
  globalStyles?: Record<any, any>;
  styles?: Record<any, any>;
};

export function withStyles<TProps>(
  Component: FunctionComponent<TProps & WithStylesImportType>,
  imports?: {
    globalStyles?: Record<any, any>;
    styles?: Record<any, any>;
  }
) {
  const styles = imports?.styles ?? {};
  const globalStyles = imports?.globalStyles ?? defaultGlobalStyles ?? {};

  const WithStyles = (props: TProps) => (
    <Component {...props} globalStyles={globalStyles} styles={styles} />
  );

  WithStyles.displayName = `withStyles(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithStyles;
}
