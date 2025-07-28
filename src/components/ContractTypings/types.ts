import { CustomType } from 'lib/sdkCore';
import { UserInterfaceType } from 'types';

export interface ContractTypingsUIType extends UserInterfaceType {}

export interface ContractTypingUIType extends UserInterfaceType {
  type: CustomType;
  isOpen?: boolean;
}
