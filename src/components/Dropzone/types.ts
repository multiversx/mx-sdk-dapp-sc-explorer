import { MouseEvent } from 'react';
import { FormikProps } from 'formik';
import { DropzoneOptions } from 'react-dropzone';

import { UserInterfaceType } from 'types';

export enum AcceptedFileTypeEnum {
  wasm = '.wasm',
  json = '.json',
  applicationJson = '.application/json'
}

export type DropzoneFilesErrorsType = Record<string, string>;

export interface FileType {
  fileName: string;
  fileError?: string;
}

export interface DropzoneUIType extends UserInterfaceType {
  acceptedFileTypes: AcceptedFileTypeEnum[];
  acceptMultipleFiles?: DropzoneOptions['multiple'];
  files?: FileType[];
  defaultMessage?: string;
  successMessage: string;
  errorMessage?: string;
  disabled?: boolean;
  onFileDrop: DropzoneOptions['onDrop'];
  onFileRemoveAll?: (event: MouseEvent<HTMLDivElement>) => void;
  onFileRemove?: (fileIndex: number, event: MouseEvent<HTMLDivElement>) => void;
}

export interface DropzoneFileUIType
  extends FileType,
    Required<Pick<DropzoneUIType, 'onFileRemove'>> {
  fileIndex: number;
  disabled?: DropzoneUIType['disabled'];
}

export interface DropzoneWasmUIType
  extends FormikProps<any>,
    UserInterfaceType {
  fieldName: string;
}
