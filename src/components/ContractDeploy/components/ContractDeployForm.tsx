import React from 'react';
import {
  faCopy,
  faPlay,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer, Code } from '@multiversx/sdk-core/out';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { lazy, mixed, object } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import {
  LoginButtonWrapper,
  Code as CodeComponent,
  InputList
} from 'components';
import { DropzoneWasm } from 'components/Dropzone/DropzoneWasm';
import { useSCExplorerContext } from 'contexts';
import { getInitalFormConfig, getNativeArgumentsFromValues } from 'helpers';
import {
  ContractDeployFormUIType,
  FormikAbiType,
  ContractDeployFormikFieldsEnum
} from 'types';
import styles from '../styles.module.scss';

export const ContractDeployForm = (props: ContractDeployFormUIType) => {
  const { onSubmit, isLoading, generalError } = props;
  const { smartContract, customClassNames, icons } = useSCExplorerContext();
  const { abiRegistry } = smartContract || {};
  const { input } = abiRegistry?.constructorDefinition ?? {
    input: []
  };

  const {
    playIcon = faPlay,
    loadIcon = faCircleNotch,
    copyIcon = faCopy
  } = icons ?? {};

  const initialValues: FormikAbiType = Object.fromEntries([
    ...input.map((input) => {
      return [input.name, getInitalFormConfig({ type: input.type })];
    }),
    [ContractDeployFormikFieldsEnum.wasmFileContent, '']
  ]);

  const validationSchema = lazy((innerObj) => {
    if (innerObj !== undefined) {
      return object().test(
        'validArguments',
        (existingVal: FormikAbiType, { createError }) => {
          try {
            const { wasmFileContent, ...value } = existingVal;
            const existingValues = getNativeArgumentsFromValues(value);
            if (abiRegistry?.constructorDefinition) {
              NativeSerializer.nativeToTypedValues(
                existingValues || [],
                abiRegistry.constructorDefinition
              );
            }
            if (wasmFileContent && wasmFileContent.toString() === '') {
              return createError({
                path: ContractDeployFormikFieldsEnum.wasmFileContent,
                message: 'Empty File'
              });
            }
          } catch (error) {
            return createError({
              path: 'general',
              message: String(error)
            });
          }

          return true;
        }
      );
    }
    return mixed().notRequired();
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (sumbittedValues) => {
        const { wasmFileContent, ...rest } = sumbittedValues;
        const values = getNativeArgumentsFromValues(rest);
        await onSubmit({
          wasmFileContent: wasmFileContent as Code,
          values
        });
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => {
        const { errors, values } = formik;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.contractDeployForm)}
          >
            {abiRegistry?.constructorDefinition && (
              <div className={classNames(styles?.contractDeployFormFields)}>
                <InputList
                  input={input}
                  endpoint={abiRegistry?.constructorDefinition}
                  formik={formik}
                  excludedKeys={[
                    ContractDeployFormikFieldsEnum.wasmFileContent
                  ]}
                />
                {(hasOnlyGeneralValidationError || generalError) && (
                  <div
                    className={classNames(
                      styles?.endpointGeneralError,
                      globalStyles?.generalError
                    )}
                  >
                    {hasOnlyGeneralValidationError &&
                      typeof errors?.general === 'string' && (
                        <p>{errors.general}</p>
                      )}
                    {generalError && <p>{generalError}</p>}
                  </div>
                )}
              </div>
            )}

            <DropzoneWasm
              {...formik}
              fieldName={ContractDeployFormikFieldsEnum.wasmFileContent}
            />

            <LoginButtonWrapper
              buttonText='to deploy a contract.'
              className={classNames(styles?.contractDeployFormButton)}
            >
              <button
                className={classNames(
                  globalStyles?.button,
                  globalStyles?.buttonPrimary,
                  customClassNames?.buttonClassName,
                  customClassNames?.buttonPrimaryClassName,
                  styles?.contractDeployFormButton
                )}
                type='submit'
                {...(isLoading || !formik.isValid ? { disabled: true } : {})}
              >
                Deploy Contract
                {isLoading ? (
                  <FontAwesomeIcon
                    icon={loadIcon}
                    className='fa-spin fast-spin'
                  />
                ) : (
                  <FontAwesomeIcon icon={playIcon} />
                )}
              </button>
            </LoginButtonWrapper>

            {values?.[ContractDeployFormikFieldsEnum.wasmFileContent] && (
              <div
                className={classNames(
                  globalStyles?.codeContainer,
                  styles?.contractDeployCodeContainer
                )}
              >
                <h6 className={classNames(globalStyles?.cardContainerTitle)}>
                  WASM File Preview
                </h6>
                <div className={classNames(globalStyles?.codeBlock)}>
                  <div className={classNames(globalStyles?.buttonHolder)}>
                    <CopyButton
                      text={values[
                        ContractDeployFormikFieldsEnum.wasmFileContent
                      ].toString()}
                      className={classNames(globalStyles?.copyButton)}
                      copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
                    />
                  </div>
                  <CodeComponent
                    className={classNames(
                      globalStyles?.endpointOutputResultsCode
                    )}
                    code={values[
                      ContractDeployFormikFieldsEnum.wasmFileContent
                    ].toString()}
                    showLineNumbers={false}
                    wrapLongLines={true}
                    language='properties'
                  />
                </div>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
