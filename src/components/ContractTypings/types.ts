import { CustomType } from '@multiversx/sdk-core/out';
import { UserInterfaceType } from 'types';

export interface ContractTypingsUIType extends UserInterfaceType {}

export interface ContractTypingUIType extends UserInterfaceType {
  type: CustomType;
}
