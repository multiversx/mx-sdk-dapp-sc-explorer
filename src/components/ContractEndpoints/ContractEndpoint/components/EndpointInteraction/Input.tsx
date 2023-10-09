import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { InputUIType } from 'types';

export const Input = ({
  name,
  value,
  definition,
  children,
  handleChange,
  handleBlur,
  customInterface,
  errors,
  touched
}: InputUIType) => {
  const definitionTypeName = definition?.type?.isGenericType()
    ? definition?.type?.getFirstTypeParameter()?.toString()
    : definition?.type?.toString();

  const knownInputType = DOCUMENTED_TYPES?.[definitionTypeName];
  const inputMode =
    knownInputType?.type === 'integer' ||
    knownInputType?.inputType === 'numeric'
      ? 'numeric'
      : ''; // UI Only
  const placeholder = knownInputType?.example ?? definitionTypeName;
  const hasError = name in errors && name in touched;

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
          { [globalStyles?.inputInvalid]: hasError },
          {
            ...(customInterface?.customClassNames?.inputInvalidClassName
              ? {
                  [customInterface.customClassNames.inputInvalidClassName]:
                    hasError
                }
              : {})
          }
        )}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby={`${name}-${definitionTypeName}-definition`}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...(!Array.isArray(value)
          ? {
              defaultValue: value
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
          id={`${name}-${definitionTypeName}-definition`}
        >
          <code className={classNames(globalStyles?.fieldValue)}>
            {definitionTypeName}
          </code>
          <DefinitionsTooltip typeName={definitionTypeName} />
        </div>
        {children}
      </div>
      {hasError && (
        <div
          className={classNames(
            globalStyles?.inputInvalidFeedback,
            customInterface?.customClassNames?.inputInvalidFeedbackClassName
          )}
        >
          {errors?.[name]}
        </div>
      )}
    </div>
  );
};
