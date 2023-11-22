import React, { memo, Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { PanelHeader } from 'components';
import {
  CONTRACT_FILE_EXTENSION,
  CONTRACT_FILE_TEST_PATH
} from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { ContractFile } from './ContractFile';
import styles from './styles.module.scss';
import type { ContractFilesUIType } from './types';

export const ContractFilesComponent = ({
  highlightFileHash
}: ContractFilesUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { verifiedContract } = smartContract;
  const { hasSourceCode } = support;
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

  if (!hasSourceCode) {
    return null;
  }

  const files = verifiedContract?.source?.contract?.entries ?? [];

  const filteredEntries = files.filter(
    ({ path, isTestFile }) =>
      path.endsWith(CONTRACT_FILE_EXTENSION) &&
      !path.includes(CONTRACT_FILE_TEST_PATH) &&
      !isTestFile
  );

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

export const ContractFiles = memo(ContractFilesComponent);
