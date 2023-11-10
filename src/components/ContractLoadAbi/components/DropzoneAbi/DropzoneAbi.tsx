import React, { useState } from 'react';
import { FormikProps, getIn } from 'formik';

import { Dropzone } from 'components';
import { useSmartContractDispatch } from 'contexts';
import {
  AcceptedFileTypeEnum,
  FormikLoadAbiType,
  FileType,
  SmartContractDispatchTypeEnum,
  ContractLoadAbiFormikFieldsEnum
} from 'types';

export interface DropzoneAbiPropsType {
  formikProps: FormikProps<FormikLoadAbiType>;
}

export const DropzoneAbi = ({
  setFieldValue,
  setFieldTouched,
  setErrors,
  errors
}: FormikProps<FormikLoadAbiType>) => {
  const smartContractDispatch = useSmartContractDispatch();
  const [file, setFile] = useState<FileType | undefined>();

  const onRemove = () => {
    setFile(undefined);
    setFieldValue(ContractLoadAbiFormikFieldsEnum.abiFileContent, {});
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
    setFieldTouched(ContractLoadAbiFormikFieldsEnum.abiFileContent, true);
    fileReader.onload = () => {
      if (fileReader.result) {
        try {
          const parsedAbiFileContent = JSON.parse(fileReader.result.toString());
          setFieldValue(
            ContractLoadAbiFormikFieldsEnum.abiFileContent,
            parsedAbiFileContent
          );
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
      errorMessage={getIn(
        errors,
        ContractLoadAbiFormikFieldsEnum.abiFileContent
      )}
    />
  );
};
