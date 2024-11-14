import { ContractInputType, ContractOutputType } from 'types';

export interface FormatEventsFieldsType {
  inputs?: ContractInputType[];
  outputs?: ContractOutputType[];
}

export const formatEventFields = ({
  inputs,
  outputs
}: FormatEventsFieldsType) => {
  if (inputs && inputs.length > 0) {
    return inputs.map(({ name, type }) => {
      return { name, value: type };
    });
  }
  if (outputs && outputs.length > 0) {
    return outputs.map(({ type }) => {
      return { name: type };
    });
  }

  return [];
};
