import { Type, StructType } from '@multiversx/sdk-core/out';

import { CUSTOM_TYPE_PREFIX } from 'constants/general';
import { FormikAbiType } from 'types';

function buildObj(props: FormikAbiType[]) {
  return props.reduce((result, obj) => {
    const key = Object.keys(obj)[0];
    result[key] = obj[key];
    return result;
  }, {});
}

export function getInitalFormConfig({
  type,
  name = '',
  index = 0
}: {
  type: Type;
  name?: string;
  index?: number;
}): FormikAbiType {
  const typeParameters = type?.getTypeParameters() ?? [];
  const hasDependencies = type?.getNamesOfDependencies();
  const entryName = `${
    name ? `${CUSTOM_TYPE_PREFIX}${name}:` : ''
  }${index}:${type?.getFullyQualifiedName()}`;

  if (hasDependencies.length > 0) {
    try {
      const fieldsDefinitions = (type as StructType)
        .getFieldsDefinitions()
        .map(({ type, name }, index) =>
          getInitalFormConfig({ type, name, index })
        );
      const res = name ? fieldsDefinitions : buildObj(fieldsDefinitions);

      return {
        [entryName]: fieldsDefinitions.length > 0 ? res : ''
      };
    } catch {}
  }

  const props = typeParameters?.map((curentType: Type, index) =>
    getInitalFormConfig({ type: curentType, index })
  );

  const upperBound = type?.getCardinality()?.getUpperBound();
  const isObj = Boolean(
    type?.getCardinality()?.isComposite() &&
      upperBound !== undefined &&
      props.length > 0 &&
      props.length === upperBound
  );
  const res = isObj ? buildObj(props) : props;

  return {
    [entryName]: props.length > 0 ? res : ''
  };
}
