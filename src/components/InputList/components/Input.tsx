import React from 'react';
import { Type } from '@multiversx/sdk-core/out';
import classNames from 'classnames';
import { Field, getIn } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import {
  InputUIType,
  DocumentedTypesExampleType,
  ContractTypingsTypeEnum
} from 'types';
import { getTypeFromPrefix, validateFieldType } from '../helpers';

export const Input = ({
  name,
  defaultValue,
  type,
  formik,
  children,
  'data-testid': dataTestId
}: InputUIType) => {
  if (!formik) {
    return null;
  }
  const { customClassNames, smartContract } = useSCExplorerContext();
  const { rawAbi, abiRegistry } = smartContract;
  const inputError = getIn(formik.errors, name);
  const prefixParts = name.split('.');
  const curentType =
    prefixParts.length > 0 ? prefixParts[prefixParts.length - 1] : name;

  const inputType = type ?? getTypeFromPrefix(curentType);
  const definitionTypeName = inputType?.toString() ?? '';
  const knownInputType = definitionTypeName
    ? DOCUMENTED_TYPES?.[definitionTypeName]
    : ({} as DocumentedTypesExampleType);

  const rawType = rawAbi?.types[definitionTypeName]?.type;
  const enums =
    rawType === ContractTypingsTypeEnum.enum
      ? abiRegistry?.getEnum(definitionTypeName)
      : undefined;
  const isSimpleEnum =
    enums &&
    enums.variants.every(
      (variant) => variant?.getFieldsDefinitions().length === 0
    );

  const placeholder = knownInputType?.example ?? definitionTypeName;
  const inputMode =
    knownInputType?.type === 'integer' ||
    knownInputType?.inputType === 'numeric'
      ? 'numeric'
      : ''; // UI Only

  const isOptional = Boolean(
    type?.getFullyQualifiedName() &&
      name.includes(`Optional<${type?.getFullyQualifiedName()}>`)
  );

  const validateField = ({
    value,
    inputType,
    isOptional
  }: {
    value: any;
    inputType?: Type;
    isOptional?: boolean;
  }) => {
    if (value === undefined && !isOptional) {
      return 'Required';
    }

    const formattedValue = value.replace(/\s/g, '');
    if (inputType && definitionTypeName) {
      try {
        if (enums) {
          const isValidEnum = enums.variants?.find((en) => {
            return (
              en.name === formattedValue &&
              en.getFieldsDefinitions()?.length === 0
            );
          });

          if (!isValidEnum) {
            return 'Invalid Enum';
          }
        } else {
          const errorMessage = validateFieldType(
            formattedValue,
            inputType,
            isOptional
          );
          if (errorMessage) {
            return errorMessage;
          }
        }
      } catch (error) {
        console.warn('Known Input Error: ', error);
        return 'Invalid Input';
      }
    }

    return;
  };

  if (isSimpleEnum) {
    return (
      <Field
        as='select'
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        data-testid={dataTestId ?? ''}
        className={classNames(
          globalStyles?.select,
          customClassNames?.selectClassName
        )}
      >
        <option value='' disabled hidden>
          Select...
        </option>
        {enums.variants.map((variant, index) => (
          <option
            value={variant.name}
            key={variant.name ?? index}
            {...(defaultValue === variant.name
              ? {
                  selected: true
                }
              : {})}
          >
            {variant.name}
          </option>
        ))}
      </Field>
    );
  }

  return (
    <div
      className={classNames(
        globalStyles?.inputGroup,
        customClassNames?.inputGroupClassName
      )}
    >
      <Field
        type='text'
        validate={(value: any) =>
          validateField({ value, inputType, isOptional })
        }
        className={classNames(
          globalStyles?.input,
          customClassNames?.inputClassName,
          { [globalStyles?.inputInvalid]: inputError },
          {
            ...(customClassNames?.inputInvalidClassName
              ? {
                  [customClassNames.inputInvalidClassName]: inputError
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
        data-testid={dataTestId ?? ''}
        {...(defaultValue
          ? {
              defaultValue
            }
          : {})}
        {...(inputMode ? { inputMode } : {})}
      />
      <div
        className={classNames(
          globalStyles?.inputGroupAppend,
          customClassNames?.inputGroupAppendClassName
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
            customClassNames?.inputInvalidFeedbackClassName
          )}
        >
          {inputError}
        </div>
      )}
    </div>
  );
};
