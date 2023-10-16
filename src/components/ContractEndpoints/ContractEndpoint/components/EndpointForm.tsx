import React from 'react';
import { faPlay, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useFormik } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { LoginButtonWrapper } from 'components';
import { EndpointFormUIType, FormikAbiType } from 'types';
import { EndpointInteraction } from './EndpointInteraction';
import {
  getInitalFormConfig,
  //getYupSchemaFromMetaData,
  getNativeArgumentsFromValues
} from '../helpers';
import styles from '../styles.module.scss';

export const EndpointForm = (props: EndpointFormUIType) => {
  const {
    endpoint,
    onSubmit,
    buttonText,
    result,
    isLoading,
    generalError,
    className,
    customInterface
  } = props;
  const { input, modifiers } = endpoint;
  const { mutability } = modifiers;
  const { playIcon = faPlay, loadIcon = faCircleNotch } =
    customInterface?.icons ?? {};

  const initialValues: FormikAbiType = Object.fromEntries(
    input.map((input) => {
      return [input?.name, getInitalFormConfig(input.type)];
    })
  );

  // const validationSchema = getYupSchemaFromMetaData([initialValues], [], []);
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const nativeArgs = getNativeArgumentsFromValues(values);
      await onSubmit(nativeArgs);
    }
    //validationSchema
  });
  const { errors } = formik;

  const hasOnlyGeneralValidationError =
    errors?.general && Object?.keys(errors).length === 1;

  return (
    <form onSubmit={formik.handleSubmit} className={classNames(className)}>
      <EndpointInteraction
        customInterface={customInterface}
        endpoint={endpoint}
        formik={formik}
        result={result}
      />
      {(hasOnlyGeneralValidationError || generalError) && (
        <div className={classNames(styles?.endpointGeneralError)}>
          {hasOnlyGeneralValidationError && <p>general validation error</p>}
          {generalError && <p>{generalError}</p>}
        </div>
      )}
      <div className={classNames(styles?.endpointActionWrapper)}>
        <LoginButtonWrapper
          customInterface={customInterface}
          className={classNames(styles?.buttonEndpointAction)}
          mutability={mutability}
        >
          <button
            className={classNames(
              globalStyles?.button,
              globalStyles?.buttonPrimary,
              customInterface?.customClassNames?.buttonClassName,
              customInterface?.customClassNames?.buttonPrimaryClassName,
              styles?.buttonEndpointAction
            )}
            type='submit'
            {...(isLoading || !formik.isValid ? { disabled: true } : {})}
          >
            {buttonText}
            {isLoading ? (
              <FontAwesomeIcon icon={loadIcon} className='fa-spin fast-spin' />
            ) : (
              <FontAwesomeIcon icon={playIcon} />
            )}
          </button>
        </LoginButtonWrapper>
      </div>
    </form>
  );
};
