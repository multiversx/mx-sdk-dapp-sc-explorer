import React from 'react';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export const DocsPanelComponent = ({ globalStyles }: WithStylesImportType) => {
  const { smartContract } = useSCExplorerContext();
  const { rawAbi } = smartContract;
  const docs = rawAbi?.['constructor']?.docs ? rawAbi['constructor'].docs : [];

  if (docs.length === 0) {
    return null;
  }

  return (
    <div className={classNames(globalStyles?.panel, globalStyles?.aboutPanel)}>
      <div className={classNames(globalStyles?.panelMode)}>About</div>
      <div
        className={classNames(
          globalStyles?.panelContent,
          globalStyles?.aboutPanelContent
        )}
      >
        {docs.map((string, key) => (
          <p key={key}>{string}</p>
        ))}
      </div>
    </div>
  );
};

export const DocsPanel = withStyles(DocsPanelComponent, {});
