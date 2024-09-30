import { FieldDefinition } from '@multiversx/sdk-core/out';
import { UserInterfaceType } from 'types';

export interface EndpointDefinitionListType extends UserInterfaceType {
  definitions: FieldDefinition[];
}
