import { MouseEvent } from 'react';
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
  successMessage: string;
  onFileDrop: DropzoneOptions['onDrop'];
  onFileRemoveAll?: (event: MouseEvent<HTMLDivElement>) => void;
  onFileRemove?: (fileIndex: number, event: MouseEvent<HTMLDivElement>) => void;
  errorMessage?: string;
  disabled?: boolean;
}

export interface DropzoneFileUIType
  extends FileType,
    Required<Pick<DropzoneUIType, 'onFileRemove'>> {
  fileIndex: number;
  disabled?: DropzoneUIType['disabled'];
}