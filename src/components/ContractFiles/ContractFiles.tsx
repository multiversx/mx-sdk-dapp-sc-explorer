import React, { Fragment, useEffect, useRef } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  CONTRACT_FILE_EXTENSION,
  CONTRACT_FILE_TEST_PATH
} from 'constants/general';
import { useScContext } from 'context';

import { ContractFile } from './ContractFile';
import styles from './styles.module.scss';
import type { ContractFilesUIType } from './types';

export const ContractFiles = ({
  highlightFileHash,
  customInterface
}: ContractFilesUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const { verifiedContract } = useScContext();
  const files = verifiedContract?.source?.contract?.entries;

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

  if (!(files && files.length > 0)) {
    return null;
  }

  const filteredEntries = files.filter(
    ({ path, isTestFile }) =>
      path.endsWith(CONTRACT_FILE_EXTENSION) &&
      !path.includes(CONTRACT_FILE_TEST_PATH) &&
      !isTestFile
  );

  return (
    <div
      className={classNames(
        styles.contractFiles,
        globalStyles?.wrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      {filteredEntries && filteredEntries.length > 0 && (
        <div
          className={classNames(
            styles.contractFilesList,
            globalStyles.list,
            customInterface?.customClassNames?.listClassName
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
                  isOpen={index === 0 || selectedFile}
                  className={classNames(
                    styles.contractFilesListItem,
                    globalStyles.listItem,
                    customInterface?.customClassNames?.listItemClassName
                  )}
                  customInterface={customInterface}
                />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
