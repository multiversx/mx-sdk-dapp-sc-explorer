import React, { MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';

import { withStyles } from 'hocs/withStyles';

import { DropzoneFile } from './components/DropzoneFile';
import { getDropzoneStatusData, handleDropzoneHover } from './helpers';
import { DropzoneUIType } from './types';

export const DropzoneComponent = ({
  className,
  acceptedFileTypes,
  acceptMultipleFiles,
  'data-testid': dataTestId,
  onFileDrop,
  onFileRemove,
  files = [],
  defaultMessage,
  successMessage,
  errorMessage,
  disabled,
  styles
}: DropzoneUIType) => {
  const errorsExist = files.some((file) => file.fileError);
  const filesUploadedSuccessfully = !errorsExist && files.length > 0;

  const { statusIcon, statusLabel } = getDropzoneStatusData({
    errorsExist,
    filesUploadedSuccessfully,
    successMessage,
    defaultMessage
  });

  const { getInputProps, getRootProps, open } = useDropzone({
    accept: acceptedFileTypes,
    multiple: acceptMultipleFiles,
    noKeyboard: true,
    onDragEnter: (event) =>
      handleDropzoneHover({ event, shouldShowHover: true }),
    onDragLeave: (event) =>
      handleDropzoneHover({ event, shouldShowHover: false }),
    onDrop: (
      droppedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      handleDropzoneHover({ event, shouldShowHover: false });

      if (onFileDrop) {
        onFileDrop(droppedFiles, fileRejections, event);
      }
    }
  });

  const onFileRemoveClick = (
    fileIndex: number,
    event: MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (onFileRemove) {
      onFileRemove(fileIndex, event);
    }
  };

  return (
    <div
      {...getRootProps()}
      onClick={open}
      className={classNames(styles?.dropzone, className, {
        [styles?.dropzoneSuccess]: filesUploadedSuccessfully,
        [styles?.dropzoneError]: errorsExist || errorMessage,
        [styles?.dropzoneDisabled]: disabled
      })}
    >
      <div className={classNames(styles?.dropzoneInner)}>
        <FontAwesomeIcon
          icon={statusIcon}
          className={classNames(styles?.dropzoneIcon, {
            error: errorsExist,
            success: Boolean(filesUploadedSuccessfully)
          })}
        />

        <span
          className={classNames(styles?.dropzoneText, {
            error: errorsExist,
            success: filesUploadedSuccessfully
          })}
        >
          <span className={classNames(styles?.dropzoneTextLabel)}>
            {statusLabel}
          </span>

          {files.length === 0 && (
            <span className={classNames(styles?.dropzoneTextSelect)}>
              Select a file
            </span>
          )}
        </span>

        {files.length > 0 && (
          <div className={classNames(styles?.dropzoneFiles)}>
            {files.map((file, fileIndex) => (
              <DropzoneFile
                key={`${file.fileName}-${fileIndex}`}
                onFileRemove={onFileRemoveClick}
                fileIndex={fileIndex}
                disabled={disabled}
                {...file}
              />
            ))}
          </div>
        )}
      </div>

      <input {...getInputProps()} data-testid={dataTestId ?? ''} />

      {errorMessage && (
        <div className={classNames(styles?.dropzoneErrorMessage)}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export const Dropzone = withStyles(DropzoneComponent, {
  ssrStyles: () => import('components/Dropzone/styles.module.scss'),
  clientStyles: () => require('components/Dropzone/styles.module.scss').default
});
