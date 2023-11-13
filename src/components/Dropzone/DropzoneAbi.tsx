import React, { useState } from 'react';
import { AbiRegistry } from '@multiversx/sdk-core/out';
import { FormikProps, getIn } from 'formik';

import { Dropzone } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useSmartContractDispatch } from 'contexts';
import {
  AcceptedFileTypeEnum,
  FormikLoadAbiType,
  FileType,
  SmartContractDispatchTypeEnum
} from 'types';

export interface DropzoneAbiPropsType extends FormikProps<FormikLoadAbiType> {
  fieldName: string;
}

export const DropzoneAbi = ({
  fieldName,
  setFieldValue,
  setFieldTouched,
  setErrors,
  errors
}: DropzoneAbiPropsType) => {
  const smartContractDispatch = useSmartContractDispatch();
  const [file, setFile] = useState<FileType | undefined>();

  const onRemove = () => {
    setFile(undefined);
    setFieldValue(fieldName, undefined);
    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setRawAbi,
      rawAbi: undefined
    });
    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setAbiRegistry,
      abiRegistry: undefined
    });
  };

  const onFileDrop = ([newFile]: File[]) => {
    const fileReader = new FileReader();
    setFieldTouched(fieldName, true);
    fileReader.onload = () => {
      if (fileReader.result) {
        try {
          const abi = JSON.parse(fileReader.result.toString());
          setFieldValue(fieldName, abi);
          if (!abi.name) {
            abi.name = INTERFACE_NAME_PLACEHOLDER;
          }
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setRawAbi,
            rawAbi: abi
          });
          const abiRegistry = AbiRegistry.create(abi);
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setAbiRegistry,
            abiRegistry
          });
        } catch {
          setErrors({
            abiFileContent: 'Invalid ABI File'
          });
        }
      }
    };

    if (newFile) {
      setFile({ fileName: newFile.name });
      fileReader.readAsText(newFile);
    }
  };

  return (
    <Dropzone
      successMessage='ABI Loaded'
      acceptedFileTypes={[AcceptedFileTypeEnum.json]}
      onFileRemove={onRemove}
      files={file ? [file] : []}
      onFileDrop={onFileDrop}
      errorMessage={getIn(errors, fieldName)}
    />
  );
};
