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
  }) => Promise<void>;
  isLoading?: boolean;
  generalError?: string;
  buttonText?: string;
  buttonLoginDescription?: string | React.ReactNode;
  buttonDescription?: string | React.ReactNode;
}

export enum DeployUpgradeFileFormikFieldsEnum {
  wasmFileContent = 'wasmFileContent'
}
