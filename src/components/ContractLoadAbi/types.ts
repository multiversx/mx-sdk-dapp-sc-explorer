import { UserInterfaceType } from 'types';

export interface ContractLoadAbiUIType extends UserInterfaceType {}

export enum ContractLoadAbiFormikFieldsEnum {
  contractAddress = 'contractAddress',
  abiFileContent = 'abiFileContent'
}

export interface FormikLoadAbiType {
  [ContractLoadAbiFormikFieldsEnum.contractAddress]: string;
  [ContractLoadAbiFormikFieldsEnum.abiFileContent]: any;
}
