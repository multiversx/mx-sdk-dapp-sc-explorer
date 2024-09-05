import React, { useEffect, useState } from 'react';
import { FormikProps, getIn } from 'formik';

import { Dropzone } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useSmartContractDispatch } from 'contexts';
import { getAbiRegistry } from 'helpers';
import {
  AcceptedFileTypeEnum,
  FormikLoadAbiType,
  FileType,
  SmartContractDispatchTypeEnum,
  DataTestIdsEnum
} from 'types';

export interface DropzoneAbiPropsType extends FormikProps<FormikLoadAbiType> {
  fieldName: string;
}

export const DropzoneAbi = ({
  fieldName,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  setErrors,
  errors,
  values
}: DropzoneAbiPropsType) => {
  const smartContractDispatch = useSmartContractDispatch();
  const [file, setFile] = useState<FileType | undefined>();
  const [parseError, setParseError] = useState<string>();

  const onRemove = () => {
    setFile(undefined);
    setFieldValue(fieldName, undefined);
    setParseError(undefined);
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
    setParseError(undefined);
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
            type: SmartContractDispatchTypeEnum.setVerifiedContract,
            verifiedContract: undefined
          });
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setRawAbi,
            rawAbi: abi
          });
          const abiRegistry = getAbiRegistry(abi);
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setAbiRegistry,
            abiRegistry
          });
        } catch (error) {
          setParseError(String(error));
          setErrors({
            [fieldName]: 'Invalid ABI File'
          });
        }
      }
    };

    if (newFile) {
      setFile({ fileName: newFile.name });
      fileReader.readAsText(newFile);
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
      defaultMessage='Drag and drop your ABI file here or'
      successMessage='ABI Loaded'
      acceptedFileTypes={[AcceptedFileTypeEnum.json]}
      onFileRemove={onRemove}
      files={file ? [file] : []}
      onFileDrop={onFileDrop}
      errorMessage={parseError || getIn(errors, fieldName)}
      data-testid={DataTestIdsEnum.abiDropzone}
    />
  );
};
