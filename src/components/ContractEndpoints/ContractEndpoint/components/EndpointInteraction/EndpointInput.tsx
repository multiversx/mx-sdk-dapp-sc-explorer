import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FieldArray } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { useScContext } from 'context';
import { getUniqueDefinitionName } from 'helpers';
import { EndpointInputUIType, ContractEndpointMutabilityEnum } from 'types';

import { Input } from './Input';
import styles from './styles.module.scss';

export const EndpointInput = (props: EndpointInputUIType) => {
  const { canRead, canMutate } = useScContext();
  const {
    definition,
    mutability,
    handleChange,
    handleBlur,
    value,
    errors,
    touched,
    index: endpointIndex,
    name,
    customInterface
  } = props;

  const cardinality = definition?.type?.getCardinality();

  if (value === undefined) {
    return null;
  }

  if (mutability === ContractEndpointMutabilityEnum.readonly && !canRead) {
    return null;
  }

  if (mutability === ContractEndpointMutabilityEnum.mutable && !canMutate) {
    return null;
  }

  if (cardinality?.getUpperBound() === 1 && Array.isArray(value)) {
    console.info('Invalid number of inputs');
    return null;
  }

  const hasFormikProps = handleBlur && handleChange && errors && touched;
  if (!hasFormikProps) {
    return null;
  }

  const uniqueName =
    name ?? getUniqueDefinitionName({ definition, index: endpointIndex });
  const { plusIcon = faPlus } = customInterface?.icons ?? {};

  if (cardinality?.getUpperBound() === 1) {
    return (
      <div className={classNames(styles?.endpointInputWrapper)}>
        <Input
          definition={definition}
          value={value}
          name={uniqueName}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          customInterface={customInterface}
        />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className={classNames(styles?.endpointInputWrapper)}>
        <FieldArray
          name={uniqueName}
          render={(arrayHelpers) => {
            return (
              <>
                {value.map((value, index) => {
                  const uniqueIndexedName = `${uniqueName}.${index}`;
                  return (
                    <Input
                      definition={definition}
                      value={value}
                      name={uniqueIndexedName}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      key={index}
                      customInterface={customInterface}
                    >
                      <>
                        {index > 0 && (
                          <button
                            type='button'
                            className={classNames(
                              globalStyles?.button,
                              globalStyles?.buttonSecondary,
                              customInterface?.customClassNames
                                ?.buttonClassName,
                              customInterface?.customClassNames
                                ?.buttonSecondaryClassName,
                              styles?.buttonRemoveArgument
                            )}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                        )}
                      </>
                    </Input>
                  );
                })}
                {cardinality?.isComposite() &&
                  value.length - 1 <= cardinality?.getUpperBound() && (
                    <button
                      type='button'
                      className={classNames(
                        globalStyles?.button,
                        globalStyles?.buttonSecondary,
                        customInterface?.customClassNames?.buttonClassName,
                        customInterface?.customClassNames
                          ?.buttonSecondaryClassName,
                        styles?.buttonAddArgument
                      )}
                      onClick={() => arrayHelpers.insert(value.length, '')}
                    >
                      Add Argument <FontAwesomeIcon icon={plusIcon} />
                    </button>
                  )}
              </>
            );
          }}
        />
      </div>
    );
  }

  return null;
};
