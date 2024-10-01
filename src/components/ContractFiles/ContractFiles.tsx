import React, { memo, Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { useGetContractFiles } from 'hooks';

import { ContractFile } from './ContractFile';
import type { ContractFilesUIType } from './types';

export const ContractFilesComponent = ({
  highlightFileHash,
  globalStyles,
  styles
}: ContractFilesUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const { customClassNames } = useSCExplorerContext();
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (highlightFileHash && ref.current && ref.current !== null) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top - 86,
          behavior: 'smooth'
        });
      }
    }, 200);
  }, [highlightFileHash]);

  const filteredEntries = useGetContractFiles();

  return (
    <div
      className={classNames(
        styles?.contractFiles,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={filteredEntries.length > 1}
        onAllExpanded={setAllExpanded}
      >
        Source Code
      </PanelHeader>
      {filteredEntries && filteredEntries.length > 0 && (
        <div
          className={classNames(
            styles?.contractFilesList,
            globalStyles?.list,
            customClassNames?.listClassName
          )}
        >
          {filteredEntries.map((file, index) => {
            const selectedFile = highlightFileHash === file.path;
            return (
              <Fragment
                key={`${file.path}-${index}`}
                {...(selectedFile ? { ref: ref } : {})}
              >
                <ContractFile
                  file={file}
                  entryNumber={index}
                  totalEntries={filteredEntries.length}
                  isOpen={
                    filteredEntries.length === 1 || selectedFile || allExpanded
                  }
                  className={classNames(
                    styles?.contractFilesListItem,
                    globalStyles?.listItem,
                    customClassNames?.listItemClassName
                  )}
                />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MemoizedContractFiles = memo(ContractFilesComponent);

export const ContractFiles = withStyles(MemoizedContractFiles, {
  ssrStyles: () => import('components/ContractFiles/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractFiles/styles.module.scss').default
});
