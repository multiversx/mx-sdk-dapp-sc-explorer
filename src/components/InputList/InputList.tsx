import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { getInitalFormConfig } from 'helpers';
import { InputListUIType } from 'types';
import { RecursiveContainer } from './components/RecursiveContainer';
import styles from './styles.module.scss';

export const InputList = (props: InputListUIType) => {
  const { formik, input, endpoint } = props;

  if (!(input && input.length > 0)) {
    return null;
  }

  const config =
    formik?.values ??
    Object.fromEntries(
      input.map((input) => {
        return [input.name, getInitalFormConfig({ type: input.type })];
      })
    );

  return (
    <div className={classNames(styles?.endpointInput, globalStyles?.panel)}>
      <div className={classNames(globalStyles?.panelMode)}>Input</div>
      <div className={classNames(globalStyles?.panelContentWrapper)}>
        <RecursiveContainer
          config={config}
          formik={formik}
          endpoint={endpoint}
          prefix=''
        />
      </div>
    </div>
  );
};
