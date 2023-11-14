import React, { useState, useEffect } from 'react';
import { Code } from '@multiversx/sdk-core/out/smartcontracts/code';
import { FormikProps, getIn } from 'formik';

import { Dropzone } from 'components';
import { AcceptedFileTypeEnum, FileType } from 'types';

export interface DropzoneWasmPropsType extends FormikProps<any> {
  fieldName: string;
}

export const DropzoneWasm = ({
  fieldName,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  setErrors,
  errors,
  values
}: DropzoneWasmPropsType) => {
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
    fileReader.onload = () => {
      if (fileReader.result) {
        try {
          const buffer = toBuffer(fileReader.result as ArrayBuffer);
          const wasmCode = Code.fromBuffer(buffer);
          setFieldValue(fieldName, wasmCode);
          setFieldTouched(fieldName, true, true);
          setFieldError(fieldName, undefined);
        } catch (error) {
          setErrors({
            wasmFileContent: 'Invalid WASM File'
          });
        }
      }
    };

    if (newFile) {
      setFile({ fileName: newFile.name });
      fileReader.readAsArrayBuffer(newFile);
    }
  };

  useEffect(() => {
    const value = getIn(values, fieldName);
    if (value === '') {
      setFile(undefined);
    }
  }, [values]);

  return (
    <Dropzone
      successMessage='WASM File Loaded'
      acceptedFileTypes={[AcceptedFileTypeEnum.wasm]}
      onFileRemove={onRemove}
      files={file ? [file] : []}
      onFileDrop={onFileDrop}
      errorMessage={getIn(errors, fieldName)}
    />
  );
};
