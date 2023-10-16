import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { EndpointInputListUIType } from 'types';
import { RecursiveContainer } from './RecursiveContainer';
import { getInitalFormConfig } from '../helpers';
import styles from '../styles.module.scss';

export const EndpointInputList = (props: EndpointInputListUIType) => {
  const { formik, input, customInterface } = props;

  if (!(input && input.length > 0)) {
    return null;
  }

  const config =
    formik?.values ??
    Object.fromEntries(
      input.map((input) => {
        return [input.name, getInitalFormConfig(input.type)];
      })
    );

  return (
    <div className={classNames(styles?.endpointInput, globalStyles?.panel)}>
      <div className={classNames(globalStyles?.panelMode)}>Input</div>
      <div className={classNames(globalStyles?.panelContentWrapper)}>
        <RecursiveContainer
          config={config}
          formik={formik}
          prefix=''
          customInterface={customInterface}
        />
      </div>
    </div>
  );
};
