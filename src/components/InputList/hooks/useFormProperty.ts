import { FormikProps, getIn } from 'formik';
import { FormikAbiType } from 'types';

export const useFormProperty = ({
  prefix,
  formik
}: {
  prefix: string;
  formik?: FormikProps<FormikAbiType>;
}) => {
  const { values, initialValues } = formik || {};
  const typeParameters = getIn(values, prefix) ?? [];
  const structure = getIn(initialValues, prefix) ?? [];
  const addNewProperty = () => {
    if (
      !(
        typeParameters.includes('') &&
        structure.length === 1 &&
        structure[0] === ''
      )
    ) {
      const newProperties = [...typeParameters, ...structure];
      if (structure.length === 0 && !newProperties.includes('')) {
        newProperties.push('');
      }
      if (formik) {
        formik.setFieldValue(prefix, newProperties);
      }
    }
  };

  const removeProperty = (propertyIndex?: number) => () => {
    if (propertyIndex !== undefined) {
      const newProperties = [...typeParameters];
      newProperties.splice(propertyIndex, 1);
      if (formik) {
        formik.setFieldValue(prefix, newProperties);
        formik.validateForm();
      }
    }
  };

  return {
    typeParameters,
    addNewProperty,
    removeProperty
  };
};
