import React from 'react';
import classNames from 'classnames';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { useGetContractDocs } from 'hooks';

export const DocsPanelComponent = ({ globalStyles }: WithStylesImportType) => {
  const docs = useGetContractDocs();

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
