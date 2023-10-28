import React, { Fragment } from 'react';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { TYPE_PREFIX_REGEX } from 'constants/general';
import { RecursiveContainerUIType, FormikAbiType } from 'types';
import { Input } from './Input';
import { getTypeFromPrefix, getNestedType } from '../helpers';
import { useFormProperty } from '../hooks';
import styles from '../styles.module.scss';

export const RecursiveContainer = ({
  config,
  formik,
  endpoint,
  prefix = '',
  customInterface
}: RecursiveContainerUIType) => {
  const { plusIcon = faPlus, minusIcon = faMinus } =
    customInterface?.icons ?? {};

  const builder = ({
    individualConfig,
    index,
    currentPrefix
  }: {
    individualConfig: FormikAbiType;
    index?: number;
    currentPrefix?: string;
  }) => {
    const formattedPrefix = `${
      prefix ? `${prefix}${prefix.endsWith('.') ? '' : '.'}` : ''
    }${index !== undefined ? `${index}${currentPrefix ? '.' : ''}` : ''}${
      currentPrefix ? `${currentPrefix}` : ''
    }`;

    const { addNewProperty, removeProperty } = useFormProperty({
      prefix: formattedPrefix,
      formik
    });

    if (Array.isArray(individualConfig)) {
      // Backup in case of a malformed initial object
      if (individualConfig.length === 0) {
        return (
          <Input
            name={`${formattedPrefix}.0`}
            formik={formik}
            defaultValue=''
            customInterface={customInterface}
          />
        );
      }

      let isComposite = false;
      let upperBound = 1;
      if (formattedPrefix.includes(':')) {
        const fullEndpointName = formattedPrefix.split(':')?.[0];
        const fieldName = fullEndpointName.split('.')?.[0];

        if (fieldName) {
          const currentInput = endpoint?.input?.find(
            ({ name }) => name === fieldName
          );

          if (currentInput && currentPrefix?.includes(':')) {
            const foundType = getNestedType({
              inputType: currentInput?.type,
              searchedType: currentPrefix
            });
            if (foundType) {
              isComposite = foundType?.getCardinality()?.isComposite();
              upperBound = foundType?.getCardinality()?.getUpperBound();
            }
          }
        }
      }
      return (
        <>
          <RecursiveContainer
            config={individualConfig}
            formik={formik}
            prefix={formattedPrefix}
            endpoint={endpoint}
            customInterface={customInterface}
          />
          {isComposite && (
            <>
              {individualConfig.length > 1 &&
                individualConfig.length !== upperBound && (
                  <button
                    type='button'
                    className={classNames(
                      globalStyles?.button,
                      globalStyles?.buttonSecondary,
                      customInterface?.customClassNames?.buttonClassName,
                      customInterface?.customClassNames
                        ?.buttonSecondaryClassName,
                      styles?.buttonRemoveArgument
                    )}
                    onClick={removeProperty(individualConfig.length - 1)}
                    {...(!formik ? { disabled: true } : {})}
                  >
                    Remove Argument <FontAwesomeIcon icon={minusIcon} />
                  </button>
                )}
              {individualConfig.length < upperBound && (
                <button
                  type='button'
                  className={classNames(
                    globalStyles?.button,
                    globalStyles?.buttonSecondary,
                    customInterface?.customClassNames?.buttonClassName,
                    customInterface?.customClassNames?.buttonSecondaryClassName,
                    styles?.buttonAddArgument
                  )}
                  onClick={addNewProperty}
                  {...(!formik ? { disabled: true } : {})}
                >
                  Add Argument <FontAwesomeIcon icon={plusIcon} />
                </button>
              )}
            </>
          )}
        </>
      );
    } else if (
      typeof individualConfig === 'object' &&
      individualConfig !== null
    ) {
      return (
        <RecursiveContainer
          config={individualConfig}
          formik={formik}
          prefix={formattedPrefix}
          endpoint={endpoint}
          customInterface={customInterface}
        />
      );
    } else {
      return (
        <Input
          name={formattedPrefix}
          formik={formik}
          defaultValue={individualConfig !== undefined ? individualConfig : ''}
          customInterface={customInterface}
        />
      );
    }
  };

  if (Array.isArray(config)) {
    return (
      <>
        {config.map((configItem: FormikAbiType, index: number) => {
          return (
            <Fragment key={`array-${index}`}>
              {builder({ individualConfig: configItem, index })}
            </Fragment>
          );
        })}
      </>
    );
  } else if (typeof config === 'object' && config !== null) {
    return (
      <>
        {Object.keys(config).map((name: string, key: number) => {
          const individualConfig = config[name] as FormikAbiType;
          const currentType = getTypeFromPrefix(name);

          return (
            <div
              className={classNames(globalStyles?.panelContentWrapperRow)}
              key={key}
            >
              {!TYPE_PREFIX_REGEX.test(name) && (
                <div className={classNames(globalStyles?.panelName)}>
                  {name}
                </div>
              )}
              <div className={classNames(globalStyles?.panelContent)}>
                {Boolean(TYPE_PREFIX_REGEX.test(name)) && currentType && (
                  <div className={classNames(globalStyles?.fieldWrapper)}>
                    <div className={classNames(globalStyles?.field)}>
                      <code className={classNames(globalStyles?.fieldValue)}>
                        {currentType?.toString()}
                      </code>
                      <DefinitionsTooltip typeName={currentType?.toString()} />
                    </div>
                  </div>
                )}
                {builder({ individualConfig, currentPrefix: name })}
              </div>
            </div>
          );
        })}
      </>
    );
  } else {
    // Improper initial state
    return null;
  }
};
