import React from 'react';
import classNames from 'classnames';
import { getIn } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { InputUIType } from 'types';
import { getTypeFromPrefix } from '../helpers';

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
    : {};

  const placeholder = knownInputType?.example ?? definitionTypeName;
  const inputMode =
    knownInputType?.type === 'integer' ||
    knownInputType?.inputType === 'numeric'
      ? 'numeric'
      : ''; // UI Only

  return (
    <div
      className={classNames(
        globalStyles?.inputGroup,
        customInterface?.customClassNames?.inputGroupClassName
      )}
    >
      <input
        type='text'
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
        placeholder={placeholder}
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
      {inputError && (
        <div
          className={classNames(
            globalStyles?.inputInvalidFeedback,
            customInterface?.customClassNames?.inputInvalidFeedbackClassName
          )}
        >
          {JSON.stringify(inputError)}
        </div>
      )}
    </div>
  );
};
