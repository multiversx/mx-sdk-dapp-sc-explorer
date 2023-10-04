import { UserInterfaceType, ContractEventType } from 'types';

export interface ContractEventsUIType extends UserInterfaceType {}

export interface ContractEventUIType extends UserInterfaceType {
  event: ContractEventType;
  title?: string;
  isOpen?: boolean;
}
