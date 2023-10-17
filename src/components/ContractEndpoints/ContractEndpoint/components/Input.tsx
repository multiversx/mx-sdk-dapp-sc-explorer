import React from 'react';
import { Type } from '@multiversx/sdk-core/out';
import classNames from 'classnames';
import { Field, getIn } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { InputUIType, DocumentedTypesExampleType } from 'types';
import { getTypeFromPrefix, validateFieldType } from '../helpers';

export const Input = ({
  name,
  defaultValue,
  formik,
  customInterface,
  children
}: InputUIType) => {
  if (!formik) {
    return null;
  }

  const inputError = getIn(formik.errors, name);
  const prefixParts = name.split('.');
  const curentType =
    prefixParts.length > 0 ? prefixParts[prefixParts.length - 1] : name;

  const inputType = getTypeFromPrefix(curentType);
  const definitionTypeName = inputType?.toString();
  const knownInputType = definitionTypeName
    ? DOCUMENTED_TYPES?.[definitionTypeName]
    : ({} as DocumentedTypesExampleType);

  const placeholder = knownInputType?.example ?? definitionTypeName;
  const inputMode =
    knownInputType?.type === 'integer' ||
    knownInputType?.inputType === 'numeric'
      ? 'numeric'
      : ''; // UI Only

  const validateField = (value: any, inputType?: Type) => {
    if (value === undefined) {
      return 'Required';
    }

    const formattedValue = value.replace(/\s/g, '');
    if (inputType) {
      try {
        const errorMessage = validateFieldType(formattedValue, inputType);
        if (errorMessage) {
          return errorMessage;
        }
      } catch (error) {
        console.warn('Invalid Input: ', error);
        return 'Invalid Input';
      }
    }

    return;
  };

  return (
    <div
      className={classNames(
        globalStyles?.inputGroup,
        customInterface?.customClassNames?.inputGroupClassName
      )}
    >
      <Field
        type='text'
        validate={(value: any) => validateField(value, inputType)}
        className={classNames(
          globalStyles?.input,
          customInterface?.customClassNames?.inputClassName,
          { [globalStyles?.inputInvalid]: inputError },
          {
            ...(customInterface?.customClassNames?.inputInvalidClassName
              ? {
                  [customInterface.customClassNames.inputInvalidClassName]:
                    inputError
                }
              : {})
          }
        )}
        placeholder={String(placeholder) ?? ''}
        aria-label={name}
        aria-describedby={`${name}-definition`}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        {...(defaultValue
          ? {
              defaultValue: defaultValue
            }
          : {})}
        {...(inputMode ? { inputMode } : {})}
      />
      <div
        className={classNames(
          globalStyles?.inputGroupAppend,
          customInterface?.customClassNames?.inputGroupAppendClassName
        )}
      >
        <div
          className={classNames(globalStyles?.field)}
          id={`${name}-definition`}
        >
          <code className={classNames(globalStyles?.fieldValue)}>
            {definitionTypeName}
          </code>
          <DefinitionsTooltip typeName={definitionTypeName} />
        </div>
        {children}
      </div>
      {inputError && typeof inputError === 'string' && (
        <div
          className={classNames(
            globalStyles?.inputInvalidFeedback,
            customInterface?.customClassNames?.inputInvalidFeedbackClassName
          )}
        >
          {inputError}
        </div>
      )}
    </div>
  );
};
