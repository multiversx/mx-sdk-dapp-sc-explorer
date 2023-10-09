import React from 'react';
import { faPlay, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer, OptionalType } from '@multiversx/sdk-core/out';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { object, lazy, string, mixed } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { getUniqueDefinitionName } from 'helpers';
import { EndpointFormUIType } from 'types';

import { EndpointInteraction } from './EndpointInteraction';
import styles from '../../styles.module.scss';
import { getInitialValues } from '../helpers';

export const EndpointForm = (props: EndpointFormUIType) => {
  const {
    endpoint,
    children,
    onSubmit,
    buttonText,
    result,
    isLoading,
    generalError,
    className,
    customInterface
  } = props;
  const { input } = endpoint;
  const { playIcon = faPlay, loadIcon = faCircleNotch } =
    customInterface?.icons ?? {};

  // Apply general checks on submit, maybe validate per field on input based on type in a later version?
  const validationSchema = lazy((obj) => {
    if (obj !== undefined) {
      const shapes = {};
      try {
        const validationKeys = Object.keys(obj);
        validationKeys.forEach((parameter) => {
          const foundInput = input.find((definition, index) => {
            return getUniqueDefinitionName({ definition, index }) === parameter;
          });
          if (foundInput) {
            const checkType = foundInput?.type?.isGenericType()
              ? foundInput?.type?.getFirstTypeParameter()
              : foundInput?.type;
            if (
              checkType &&
              !checkType?.hasExactClass(OptionalType.ClassName)
            ) {
              shapes[parameter] = string().required('Required');
            }
          }
        });
      } catch {}

      return object()
        .shape(shapes)
        .test('validArguments', (value, { createError }) => {
          try {
            const existingValues = Object.values(value);
            NativeSerializer.nativeToTypedValues(
              existingValues || [],
              endpoint
            );
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
      initialValues={getInitialValues(input)}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {(formikProps) => {
        const { errors } = formikProps;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;
        return (
          <Form className={classNames(className)}>
            <EndpointInteraction
              {...formikProps}
              customInterface={customInterface}
              endpoint={endpoint}
              result={result}
            />
            {(hasOnlyGeneralValidationError || generalError) && (
              <div className={classNames(styles?.endpointGeneralError)}>
                {hasOnlyGeneralValidationError && <p>{errors.general}</p>}
                {generalError && <p>{generalError}</p>}
              </div>
            )}

            <div className={classNames(styles?.endpointReadButton)}>
              <button
                className={classNames(
                  globalStyles?.button,
                  globalStyles?.buttonPrimary,
                  customInterface?.customClassNames?.buttonClassName,
                  customInterface?.customClassNames?.buttonPrimaryClassName,
                  styles?.buttonEndpointAction
                )}
                type='submit'
                {...(isLoading ? { disabled: true } : {})}
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
              {children}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
