import { Type } from '@multiversx/sdk-core/out';
import { FormikAbiType } from 'types';

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
      return { [`${type?.getFullyQualifiedName()}`]: '' };
    }
    return {
      [`${type?.getFullyQualifiedName()}`]: Object.fromEntries(
        typeParameters.map((definition, index) => {
          const typeParameters = definition?.getTypeParameters();
          const upperBound = definition?.getCardinality()?.getUpperBound();
          const isArray = Boolean(
            definition?.getCardinality()?.isComposite() &&
              typeParameters.length !== upperBound
          );

          return [
            `${index}:${definition?.getFullyQualifiedName()}`,
            isArray ? [''] : ''
          ];
        })
      )
    };
  }
};
