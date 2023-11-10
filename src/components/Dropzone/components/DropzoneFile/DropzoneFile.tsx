import React from 'react';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { DropzoneFileUIType } from '../../types';

export const DropzoneFile = ({
  onFileRemove,
  fileName,
  fileIndex,
  fileError,
  disabled
}: DropzoneFileUIType) => (
  <div
    key={fileName}
    onClick={(event) => event.stopPropagation()}
    className={classNames(styles?.dropzoneFile, {
      [styles?.dropzoneFileError]: Boolean(fileError)
    })}
  >
    <div className={classNames(styles?.dropzoneFileLeft)}>
      <Trim text={fileName} />
      {fileError && (
        <div className={classNames(styles?.dropzoneFileError)}>{fileError}</div>
      )}
      {!fileError && (
        <div className={classNames(styles?.dropzoneFileSuccess)}>
          <span className={classNames(styles?.dropzoneFileSuccessText)}>
            Validated
          </span>

          <FontAwesomeIcon
            className={classNames(styles?.dropzoneSuccessIcon)}
            icon={faCheck}
          />
        </div>
      )}
    </div>
    {!disabled && (
      <div className={classNames(styles?.dropzoneFileRight)}>
        <div
          onClick={(event) => onFileRemove(fileIndex, event)}
          className={classNames(styles?.dropzoneFileRemove, {
            error: Boolean(fileError)
          })}
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    )}
  </div>
);
