import { FieldDefinition } from 'lib/sdkCore';
import { UserInterfaceType } from 'types';

export interface EndpointDefinitionListType extends UserInterfaceType {
  definitions: FieldDefinition[];
}
