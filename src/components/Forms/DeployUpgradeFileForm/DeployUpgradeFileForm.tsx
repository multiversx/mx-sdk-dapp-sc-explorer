import React from 'react';
import {
  faCopy,
  faPlay,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, NativeSerializer } from '@multiversx/sdk-core/out';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { lazy, mixed, object } from 'yup';

import {
  LoginButtonWrapper,
  Code as CodeComponent,
  InputList
} from 'components';
import { DropzoneWasm } from 'components/Dropzone/DropzoneWasm';
import { useSCExplorerContext } from 'contexts';
import {
  getInitalFormConfig,
  getNativeArgumentsFromValues,
  getDefinition
} from 'helpers';
import { withStyles } from 'hocs/withStyles';
import {
  FormikAbiType,
  DeployUpgradeFileFormUIType,
  DeployUpgradeFileFormikFieldsEnum,
  DataTestIdsEnum
} from 'types';

export const DeployUpgradeFileFormComponent = (
  props: DeployUpgradeFileFormUIType
) => {
  const {
    isUpgrade = false,
    onSubmit,
    isLoading,
    generalError,
    buttonText,
    buttonLoginDescription,
    buttonDescription,
    globalStyles,
    styles
  } = props;
  const { smartContract, customClassNames, icons } = useSCExplorerContext();
  const { abiRegistry, deployedContractDetails, contractAddress } =
    smartContract ?? {};

  const endpointDefinition = getDefinition({ abiRegistry, isUpgrade });
  const { input } = endpointDefinition ?? { input: [] };

  const {
    playIcon = faPlay,
    loadIcon = faCircleNotch,
    copyIcon = faCopy
  } = icons ?? {};

  const initialValues: FormikAbiType = Object.fromEntries([
    ...input.map((input) => {
      return [input.name, getInitalFormConfig({ type: input.type })];
    }),
    [DeployUpgradeFileFormikFieldsEnum.wasmFileContent, undefined]
  ]);

  const validationSchema = lazy((innerObj) => {
    if (innerObj !== undefined && Object.keys(innerObj).length > 0) {
      return object().test(
        'validArguments',
        (existingVal: FormikAbiType, { createError }) => {
          try {
            const { wasmFileContent, ...value } = existingVal;
            if (value && Object.keys(value).length > 0) {
              const existingValues = getNativeArgumentsFromValues(value);
              if (endpointDefinition) {
                NativeSerializer.nativeToTypedValues(
                  existingValues || [],
                  endpointDefinition
                );
              }
            }
            if (wasmFileContent) {
              if (wasmFileContent.toString() === '') {
                return createError({
                  path: DeployUpgradeFileFormikFieldsEnum.wasmFileContent,
                  message: 'Empty File'
                });
              }
            } else {
              return createError({
                path: DeployUpgradeFileFormikFieldsEnum.wasmFileContent,
                message: 'Required'
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
      onSubmit={(sumbittedValues, { resetForm }) => {
        const { wasmFileContent, ...rest } = sumbittedValues;
        const values = getNativeArgumentsFromValues(rest);
        onSubmit({
          wasmFileContent: wasmFileContent as Code,
          values
        });
        resetForm();
      }}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={true}
      enableReinitialize
    >
      {(formik) => {
        const { errors, values } = formik;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;
        const isButtonDisabled =
          isLoading ||
          !formik.isValid ||
          (isUpgrade && !contractAddress && !deployedContractDetails);

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.deployUpgradeFileForm)}
          >
            {endpointDefinition && (
              <div className={classNames(styles?.deployUpgradeFileFormFields)}>
                <InputList
                  input={input}
                  endpoint={endpointDefinition}
                  formik={formik}
                  data-testid={
                    isUpgrade
                      ? DataTestIdsEnum.upgradeFormInput
                      : DataTestIdsEnum.deployFormInput
                  }
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
              fieldName={DeployUpgradeFileFormikFieldsEnum.wasmFileContent}
              data-testid={
                isUpgrade
                  ? DataTestIdsEnum.upgradeDropzone
                  : DataTestIdsEnum.deployDropzone
              }
            />

            <div className={classNames(globalStyles?.formActionWrapper)}>
              <LoginButtonWrapper
                className={classNames(styles?.deployUpgradeFileFormButton)}
                buttonDescription={
                  buttonLoginDescription && !buttonDescription
                    ? buttonLoginDescription
                    : ''
                }
                data-testid={
                  isUpgrade
                    ? DataTestIdsEnum.upgradeFormConnectBtn
                    : DataTestIdsEnum.deployFormConnectBtn
                }
              >
                <button
                  className={classNames(
                    globalStyles?.button,
                    globalStyles?.buttonPrimary,
                    customClassNames?.buttonClassName,
                    customClassNames?.buttonPrimaryClassName,
                    styles?.deployUpgradeFileFormButton
                  )}
                  type='submit'
                  data-testid={
                    isUpgrade
                      ? DataTestIdsEnum.upgradeFormBtn
                      : DataTestIdsEnum.deployFormBtn
                  }
                  {...(isButtonDisabled ? { disabled: true } : {})}
                >
                  {buttonText}
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
              {buttonDescription && (
                <div className={classNames(globalStyles?.formWarning)}>
                  <div className={classNames(globalStyles?.formWarningText)}>
                    {buttonDescription}
                  </div>
                </div>
              )}
            </div>

            {values?.[DeployUpgradeFileFormikFieldsEnum.wasmFileContent] && (
              <div
                className={classNames(
                  globalStyles?.codeContainer,
                  styles?.deployUpgradeFileFormCodeContainer
                )}
              >
                <h6 className={classNames(globalStyles?.cardContainerTitle)}>
                  WASM File Preview
                </h6>
                <div className={classNames(globalStyles?.codeBlock)}>
                  <div className={classNames(globalStyles?.buttonHolder)}>
                    <CopyButton
                      text={values[
                        DeployUpgradeFileFormikFieldsEnum.wasmFileContent
                      ].toString()}
                      className={classNames(globalStyles?.copyButton)}
                      copyIcon={copyIcon}
                    />
                  </div>
                  <CodeComponent
                    className={classNames(
                      globalStyles?.endpointOutputResultsCode
                    )}
                    code={values[
                      DeployUpgradeFileFormikFieldsEnum.wasmFileContent
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

export const DeployUpgradeFileForm = withStyles(
  DeployUpgradeFileFormComponent,
  {
    ssrStyles: () =>
      import('components/Forms/DeployUpgradeFileForm/styles.module.scss'),
    clientStyles: () =>
      require('components/Forms/DeployUpgradeFileForm/styles.module.scss')
        .default
  }
);
