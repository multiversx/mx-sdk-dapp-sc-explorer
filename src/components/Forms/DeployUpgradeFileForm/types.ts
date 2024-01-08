import { Code } from '@multiversx/sdk-core/out';
import { UserInterfaceType } from 'types';

export interface DeployUpgradeFileFormUIType extends UserInterfaceType {
  isUpgrade?: boolean;
  onSubmit: ({
    values,
    wasmFileContent
  }: {
    values: any[];
    wasmFileContent: Code;
  }) => void;
  isLoading?: boolean;
  generalError?: string;
  buttonText?: string;
  buttonLoginDescription?: React.ReactNode;
  buttonDescription?: React.ReactNode;
}

export enum DeployUpgradeFileFormikFieldsEnum {
  wasmFileContent = 'wasmFileContent'
}
