import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { EndpointInput, DefinitionsTooltip } from 'components';
import { getUniqueDefinitionName } from 'helpers';

import styles from '../../styles.module.scss';
import { EndpointInputListUIType } from '../../types';

export const EndpointInputList = (props: EndpointInputListUIType) => {
  const {
    input,
    mutability,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    customInterface
  } = props;

  if (!input || input.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.endpointInput, globalStyles.panel)}>
      <div className={classNames(globalStyles.panelMode)}>Input</div>
      <div className={classNames(globalStyles.panelContentWrapper)}>
        {input.map((definition, index) => {
          const uniqueName = getUniqueDefinitionName({
            definition,
            index
          });

          return (
            <div
              key={index}
              className={classNames(globalStyles.panelContentWrapperRow)}
            >
              <div className={classNames(globalStyles.panelName)}>
                {definition?.name}
              </div>
              <div className={classNames(globalStyles.panelContent)}>
                <div className={classNames(globalStyles.fieldWrapper)}>
                  <div className={classNames(globalStyles.field)}>
                    <code className={classNames(globalStyles.fieldValue)}>
                      {definition?.type?.toString()}
                    </code>
                    <DefinitionsTooltip
                      typeName={
                        definition?.type?.isGenericType()
                          ? definition?.type?.getFirstTypeParameter()?.getName()
                          : definition?.type?.toString()
                      }
                    />
                  </div>
                </div>
                <div className={classNames(styles.endpointInputWrapper)}>
                  <EndpointInput
                    definition={definition}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values?.[uniqueName]}
                    errors={errors}
                    touched={touched}
                    name={uniqueName}
                    mutability={mutability}
                    customInterface={customInterface}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
