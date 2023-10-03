import { UserInterfaceType, ContractEventType } from 'types';

export interface ContractEventsUIType extends UserInterfaceType {}

export interface ContractEventUIType extends UserInterfaceType {
  title?: string;
  event: ContractEventType;
}
