import React from 'react';
import classNames from 'classnames';

import { getInitalFormConfig } from 'helpers';
import { withStyles } from 'hocs/withStyles';
import { InputListUIType, DeployUpgradeFileFormikFieldsEnum } from 'types';

import { RecursiveContainer } from './components/RecursiveContainer';

export const InputListComponent = (props: InputListUIType) => {
  const {
    formik,
    input,
    endpoint,
    excludedKeys = [DeployUpgradeFileFormikFieldsEnum.wasmFileContent],
    'data-testid': dataTestId,
    globalStyles,
    styles
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

export const InputList = withStyles(InputListComponent, {
  ssrStyles: () => import('components/InputList/styles.module.scss'),
  clientStyles: () => require('components/InputList/styles.module.scss').default
});
