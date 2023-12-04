import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { getInitalFormConfig } from 'helpers';
import { InputListUIType, DeployUpgradeFileFormikFieldsEnum } from 'types';
import { RecursiveContainer } from './components/RecursiveContainer';
import styles from './styles.module.scss';

export const InputList = (props: InputListUIType) => {
  const {
    formik,
    input,
    endpoint,
    excludedKeys = [DeployUpgradeFileFormikFieldsEnum.wasmFileContent],
    'data-testid': dataTestId
  } = props;
  if (!(input && input.length > 0)) {
    return null;
  }

  const config =
    formik?.values ??
    formik?.initialValues ??
    Object.fromEntries(
      input.map((input) => {
        return [input?.name, getInitalFormConfig({ type: input.type })];
      })
    );
  const clone = structuredClone(config);
  if (excludedKeys.length > 0) {
    excludedKeys.forEach((key) => delete clone[key]);
  }

  return (
    <div className={classNames(styles?.endpointInput, globalStyles?.panel)}>
      <div className={classNames(globalStyles?.panelMode)}>Input</div>
      <div className={classNames(globalStyles?.panelContentWrapper)}>
        <RecursiveContainer
          config={clone}
          formik={formik}
          endpoint={endpoint}
          data-testid={dataTestId}
          prefix=''
        />
      </div>
    </div>
  );
};
