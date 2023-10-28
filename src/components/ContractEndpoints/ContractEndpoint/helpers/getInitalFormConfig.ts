import { Type, StructType } from '@multiversx/sdk-core/out';

import { CUSTOM_TYPE_PREFIX } from 'constants/general';
import { FormikAbiType } from 'types';

export function getInitalFormConfig(
  type: Type,
  name: string = '',
  index: number = 0
): FormikAbiType {
  const typeParameters = type?.getTypeParameters() ?? [];
  const hasDependencies = type?.getNamesOfDependencies();
  const entryName = `${
    name ? `${CUSTOM_TYPE_PREFIX}${name}:` : ''
  }${index}:${type?.getFullyQualifiedName()}`;

  if (hasDependencies.length > 0) {
    try {
      const fieldsDefinitions = (type as StructType)
        .getFieldsDefinitions()
        .map(({ type, name }) => getInitalFormConfig(type, name));

      return {
        [entryName]: fieldsDefinitions.length > 0 ? fieldsDefinitions : ''
      };
    } catch {}
  }

  const props = typeParameters?.map((curentType: Type) =>
    getInitalFormConfig(curentType)
  );
  return {
    [entryName]: props.length > 0 ? props : ''
  };
}
