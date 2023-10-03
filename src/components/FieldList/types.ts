import { UserInterfaceType, ContractFieldsType } from 'types';

export interface FieldListType {
  name: string;
  value?: string | number;
  valueType?: string;
  detail?: string;
  docs?: string[];
  discriminant?: string | number;
  subfields?: ContractFieldsType[];
}

export interface FieldListUIType extends UserInterfaceType {
  fields: FieldListType[];
}
