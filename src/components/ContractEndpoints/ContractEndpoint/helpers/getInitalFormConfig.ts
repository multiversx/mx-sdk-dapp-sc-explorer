import { Type, StructType } from '@multiversx/sdk-core/out';

import { CUSTOM_TYPE_PREFIX } from 'constants/general';
import { FormikAbiType } from 'types';

const isTypeVariadic = (type: Type) => {
  const typeParameters = type?.getTypeParameters();
  const upperBound = type?.getCardinality()?.getUpperBound();

  return Boolean(
    type?.getCardinality()?.isComposite() &&
      typeParameters.length !== upperBound
  );
};

export const getInitalFormConfig = (type: Type): FormikAbiType => {
  const typeParameters = type?.getTypeParameters();
  const upperBound = type?.getCardinality()?.getUpperBound();
  const isArray = Boolean(
    type?.getCardinality()?.isComposite() &&
      typeParameters.length !== upperBound
  );

  if (isArray) {
    const props = typeParameters?.map((curentType: Type) =>
      getInitalFormConfig(curentType)
    );

    return {
      [`${type?.getFullyQualifiedName()}`]:
        props.length === 0 ? (isArray ? [''] : '') : props
    };
  } else {
    if (typeParameters.length === 0) {
      const hasDependencies = type?.getNamesOfDependencies();
      if (hasDependencies.length > 0) {
        const fieldsDefinitions = (type as StructType).getFieldsDefinitions();
        if (fieldsDefinitions.length > 0) {
          // handle customTypes
          const objectprops = Object.fromEntries(
            fieldsDefinitions.map(({ type, name }, index) => [
              `${CUSTOM_TYPE_PREFIX}${name}:${index}:${type?.getFullyQualifiedName()}`,
              isTypeVariadic(type) ? [''] : ''
            ])
          );

          return { [`${type?.getFullyQualifiedName()}`]: objectprops };
        }
      }

      return { [`${type?.getFullyQualifiedName()}`]: '' };
    }

    return {
      [`${type?.getFullyQualifiedName()}`]: Object.fromEntries(
        typeParameters.map((definition, index) => [
          `${index}:${definition?.getFullyQualifiedName()}`,
          isTypeVariadic(definition) ? [''] : ''
        ])
      )
    };
  }
};
