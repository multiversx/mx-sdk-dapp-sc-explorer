import React, { useState } from 'react';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer, OptionalType } from '@multiversx/sdk-core/out';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { object, lazy, string, mixed } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  CollapsibleCard,
  EndpointTitle,
  EndpointInputList,
  EndpointOutput
} from 'components';
import { useScContext } from 'context';
import { getUniqueDefinitionName } from 'helpers';
import { useQueryContract } from 'hooks';
import { ContractEndpointMutabilityEnum, QueryContractResponse } from 'types';

import { getInitialValues } from './helpers';
import styles from '../styles.module.scss';
import { ContractEndpointUIType, EndpointInputValuesType } from '../types';

export const ContractEndpoint = (props: ContractEndpointUIType) => {
  const queryContract = useQueryContract();
  const { canRead } = useScContext();
  const { endpoint, className, customInterface } = props;
  const { input, output, modifiers } = endpoint;
  const { mutability } = modifiers;
  const { playIcon = faPlay } = customInterface?.icons ?? {};

  const [result, setResult] = useState<QueryContractResponse>();
  const [error, setError] = useState<string>();

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

  const onSubmit = async (values: EndpointInputValuesType) => {
    setError(undefined);
    try {
      const valuesArray = Object.values(values);
      const args = NativeSerializer.nativeToTypedValues(
        valuesArray || [],
        endpoint
      );
      const result = await queryContract({ func: endpoint.name, args });
      if (result.success && result?.data) {
        setResult(result.data);
      } else {
        if (result?.error) {
          setError(result.error);
        }
      }
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <CollapsibleCard
      {...props}
      title={endpoint.name}
      titleContent={<EndpointTitle {...props} />}
      className={classNames(className)}
      customInterface={customInterface}
    >
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
            <Form className={classNames(styles.contractEndpointWrapper)}>
              <div className={classNames(styles.contractEndpoint)}>
                <EndpointInputList
                  {...formikProps}
                  input={input}
                  mutability={mutability}
                  customInterface={customInterface}
                />
                <EndpointOutput
                  customInterface={customInterface}
                  output={output}
                  result={result}
                />
              </div>
              {(hasOnlyGeneralValidationError || error) && (
                <div className={classNames(styles.endpointGeneralError)}>
                  {hasOnlyGeneralValidationError && <p>{errors.general}</p>}
                  {error && <p>{error}</p>}
                </div>
              )}
              {canRead &&
                mutability === ContractEndpointMutabilityEnum.readonly && (
                  <div className={classNames(styles.endpointReadButton)}>
                    <button
                      className={classNames(
                        globalStyles.button,
                        globalStyles.buttonPrimary,
                        customInterface?.customClassNames?.buttonClassName,
                        customInterface?.customClassNames
                          ?.buttonPrimaryClassName,
                        styles?.buttonReadAction
                      )}
                      type='submit'
                    >
                      Query <FontAwesomeIcon icon={playIcon} />
                    </button>
                  </div>
                )}
            </Form>
          );
        }}
      </Formik>
    </CollapsibleCard>
  );
};
