import React, { useState, useEffect } from 'react';

import { getIn } from 'formik';

import { Dropzone } from 'components';
import { AcceptedFileTypeEnum, FileType, DropzoneWasmUIType } from 'types';

export const DropzoneWasm = ({
  fieldName,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  values,
  'data-testid': dataTestId
}: DropzoneWasmUIType) => {
  const [file, setFile] = useState<FileType | undefined>();

  const toBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }

    return buffer;
  };

  const onRemove = () => {
    setFile(undefined);
    setFieldValue(fieldName, undefined);
  };

  const onFileDrop = ([newFile]: File[]) => {
    const fileReader = new FileReader();
    setFieldTouched(fieldName, true);
    setFieldError(fieldName, undefined);
    setFieldValue(fieldName, undefined);
    fileReader.onload = () => {
      if (fileReader.result) {
        try {
          const buffer = toBuffer(fileReader.result as ArrayBuffer);
          const wasmCode = buffer.toString('hex');
          setFieldValue(fieldName, wasmCode);
          setFieldError(fieldName, undefined);
        } catch (error) {
          setFieldError(fieldName, 'Invalid WASM File');
          console.warn('WASM File Error: ', error);
        } finally {
          setFieldTouched(fieldName, false);
        }
      }
    };

    if (newFile) {
      setFile({ fileName: newFile.name });
      fileReader.readAsArrayBuffer(newFile);
    }
  };

  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      const value = getIn(values, fieldName);
      if (!value) {
        if (file) {
          setFile(undefined);
        }
        return;
      }

      setFieldError(fieldName, undefined);
    }
  }, [values]);

  return (
    <Dropzone
      defaultMessage='Drag and drop your .wasm file here or'
      successMessage='WASM File Loaded'
      acceptedFileTypes={[AcceptedFileTypeEnum.wasm]}
      onFileRemove={onRemove}
      files={file ? [file] : []}
      onFileDrop={onFileDrop}
      errorMessage={getIn(errors, fieldName)}
      data-testid={dataTestId}
    />
  );
};
