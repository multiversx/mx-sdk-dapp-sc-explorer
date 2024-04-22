import React, { Fragment } from 'react';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Type } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { TYPE_PREFIX_REGEX } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
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
  'data-testid': dataTestId
}: RecursiveContainerUIType) => {
  const { customClassNames, icons, support } = useSCExplorerContext();
  const { canMutate, canDeploy, canUpgrade } = support ?? {};
  const { plusIcon = faPlus, minusIcon = faMinus } = icons ?? {};

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

    let isComposite = false;
    let upperBound = 1;
    let lowerBound = 1;
    let foundType: Type | undefined = undefined;
    if (formattedPrefix.includes(':')) {
      const fullEndpointName = formattedPrefix.split(':')?.[0];
      const fieldName = fullEndpointName.split('.')?.[0];

      if (fieldName) {
        const currentInput = endpoint?.input?.find(
          ({ name }) => name === fieldName
        );
        if (currentInput && currentPrefix?.includes(':')) {
          foundType = getNestedType({
            inputType: currentInput?.type,
            searchedType: currentPrefix
          });
          if (foundType) {
            isComposite = foundType?.getCardinality()?.isComposite();
            upperBound = foundType?.getCardinality()?.getUpperBound();
            lowerBound = foundType?.getCardinality()?.getLowerBound();
          }
        }
      }
    }

    const { addNewProperty, removeProperty } = useFormProperty({
      prefix: formattedPrefix,
      formik
    });

    if (Array.isArray(individualConfig)) {
      if (individualConfig.length === 0) {
        // In case all Arguments are removed
        return (
          <>
            {individualConfig.length <= upperBound && (
              <button
                type='button'
                className={classNames(
                  globalStyles?.button,
                  globalStyles?.buttonSecondary,
                  customClassNames?.buttonClassName,
                  customClassNames?.buttonSecondaryClassName,
                  styles?.buttonAddArgument
                )}
                onClick={addNewProperty}
                {...(!formik ? { disabled: true } : {})}
              >
                Add Argument <FontAwesomeIcon icon={plusIcon} />
              </button>
            )}
          </>
        );
      }

      return (
        <>
          <RecursiveContainer
            config={individualConfig}
            formik={formik}
            prefix={formattedPrefix}
            endpoint={endpoint}
            data-testid={dataTestId}
          />
          {Boolean(isComposite && (canMutate || canDeploy || canUpgrade)) && (
            <>
              {individualConfig.length !== 0 &&
                individualConfig.length >= lowerBound &&
                individualConfig.length !== upperBound && (
                  <button
                    type='button'
                    className={classNames(
                      globalStyles?.button,
                      globalStyles?.buttonSecondary,
                      customClassNames?.buttonClassName,
                      customClassNames?.buttonSecondaryClassName,
                      styles?.buttonRemoveArgument
                    )}
                    onClick={removeProperty(individualConfig.length - 1)}
                    {...(!formik ? { disabled: true } : {})}
                  >
                    Remove Argument <FontAwesomeIcon icon={minusIcon} />
                  </button>
                )}
              {individualConfig.length <= upperBound && (
                <button
                  type='button'
                  className={classNames(
                    globalStyles?.button,
                    globalStyles?.buttonSecondary,
                    customClassNames?.buttonClassName,
                    customClassNames?.buttonSecondaryClassName,
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
          data-testid={dataTestId}
        />
      );
    } else {
      return (
        <Input
          name={formattedPrefix}
          formik={formik}
          type={foundType}
          defaultValue={individualConfig !== undefined ? individualConfig : ''}
          data-testid={dataTestId}
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
