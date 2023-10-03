import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { FieldArray } from 'formik';

import globalStyles from 'assets/styles/globals.module.scss';
import { useScContext } from 'context';
import { getUniqueDefinitionName } from 'helpers';
import { ContractEndpointMutabilityEnum } from 'types';

import { Input } from './Input';
import styles from '../../styles.module.scss';
import { EndpointInputUIType } from '../../types';

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
    key,
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

  const uniqueName =
    name ?? getUniqueDefinitionName({ definition, index: key });
  const { plusIcon = faPlus } = customInterface?.icons ?? {};

  if (cardinality?.getUpperBound() === 1) {
    return (
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
    );
  }

  if (Array.isArray(value)) {
    return (
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
                            globalStyles.button,
                            globalStyles.buttonSecondary,
                            customInterface?.customClassNames?.btnClassName,
                            customInterface?.customClassNames
                              ?.btnSecondaryClassName,
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
                      globalStyles.button,
                      globalStyles.buttonSecondary,
                      customInterface?.customClassNames?.btnClassName,
                      customInterface?.customClassNames?.btnSecondaryClassName,
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
    );
  }

  return null;
};
