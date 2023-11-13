import { Code } from '@multiversx/sdk-core/out';
import { UserInterfaceType } from 'types';

export interface ContractDeployUIType extends UserInterfaceType {}

export interface ContractDeployFormUIType extends UserInterfaceType {
  onSubmit: ({
    values,
    wasmFileContent
  }: {
    values: any[];
    wasmFileContent: Code;
  }) => Promise<void>;
  isLoading?: boolean;
  generalError?: string;
}

export enum ContractDeployFormikFieldsEnum {
  wasmFileContent = 'wasmFileContent'
}
