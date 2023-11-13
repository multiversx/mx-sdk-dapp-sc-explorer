import { UserInterfaceType, ContractEndpointMutabilityEnum } from 'types';

export interface LoginButtonUIType extends UserInterfaceType {}

export interface LoginButtonWrapperUIType extends LoginButtonUIType {
  children?: React.ReactNode;
  mutability?: string | ContractEndpointMutabilityEnum;
  buttonText?: string;
}
