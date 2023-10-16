import React, { Fragment } from 'react';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { TYPE_PREFIX } from 'constants/general';
import { RecursiveContainerUIType, FormikAbiType } from 'types';
import { Input } from './Input';
import { getTypeFromPrefix } from '../helpers';
import { useFormProperty } from '../hooks';
import styles from '../styles.module.scss';

export const RecursiveContainer = ({
  config,
  formik,
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

      return (
        <>
          <RecursiveContainer
            config={individualConfig}
            formik={formik}
            prefix={formattedPrefix}
            customInterface={customInterface}
          />
          {individualConfig.length > 1 && (
            <button
              type='button'
              className={classNames(
                globalStyles?.button,
                globalStyles?.buttonSecondary,
                customInterface?.customClassNames?.buttonClassName,
                customInterface?.customClassNames?.buttonSecondaryClassName,
                styles?.buttonRemoveArgument
              )}
              onClick={removeProperty(individualConfig.length - 1)}
              {...(!formik ? { disabled: true } : {})}
            >
              Remove Argument <FontAwesomeIcon icon={minusIcon} />
            </button>
          )}
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
              {!name.startsWith(TYPE_PREFIX) && (
                <div className={classNames(globalStyles?.panelName)}>
                  {name}
                </div>
              )}
              <div className={classNames(globalStyles?.panelContent)}>
                {Boolean(name.startsWith(TYPE_PREFIX) && currentType) && (
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
