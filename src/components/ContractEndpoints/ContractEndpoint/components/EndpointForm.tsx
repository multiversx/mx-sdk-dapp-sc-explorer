import React from 'react';
import { faPlay, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer } from '@multiversx/sdk-core/out';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { lazy, mixed, object } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { LoginButtonWrapper } from 'components';
import { EndpointFormUIType, FormikAbiType } from 'types';
import { EndpointInteraction } from './EndpointInteraction';
import { getInitalFormConfig, getNativeArgumentsFromValues } from '../helpers';
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
      return [input?.name, getInitalFormConfig({ type: input.type })];
    })
  );

  const validationSchema = lazy((innerObj) => {
    if (innerObj !== undefined) {
      return object().test('validArguments', (value, { createError }) => {
        try {
          const existingValues = getNativeArgumentsFromValues(value);
          NativeSerializer.nativeToTypedValues(existingValues || [], endpoint);
        } catch (error) {
          return createError({
            path: 'general',
            message: String(error)
          });
        }

        return true;
      });
    }
    return mixed().notRequired();
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const nativeArgs = getNativeArgumentsFromValues(values);
        await onSubmit(nativeArgs);
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {(formik) => {
        const { errors } = formik;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(className)}
          >
            <EndpointInteraction
              customInterface={customInterface}
              endpoint={endpoint}
              formik={formik}
              result={result}
            />
            {(hasOnlyGeneralValidationError || generalError) && (
              <div className={classNames(styles?.endpointGeneralError)}>
                {hasOnlyGeneralValidationError && <p>{errors?.general}</p>}
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
                    <FontAwesomeIcon
                      icon={loadIcon}
                      className='fa-spin fast-spin'
                    />
                  ) : (
                    <FontAwesomeIcon icon={playIcon} />
                  )}
                </button>
              </LoginButtonWrapper>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
