import { EndpointDefinition } from '@multiversx/sdk-core/out';
import { UserInterfaceType, ContractEndpointMutabilityEnum } from 'types';

export interface ContractEndpointsUIType extends UserInterfaceType {
  mutability?: ContractEndpointMutabilityEnum;
}

export interface BaseEndpointUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
}

export interface ContractEndpointUIType extends BaseEndpointUIType {
  title?: string;
  isOpen?: boolean;
}
