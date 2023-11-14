import React from 'react';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { TransactionStatus } from 'components';
import { SC_GAS_LIMIT, METADATA_OPTIONS } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import {
  MetadataFieldsInitialValuesType,
  DeployUpgradeModalFormUIType,
  DeployUpgradeModalInitialValuesType,
  DeployModalFormikFieldsEnum
} from 'types';
import styles from './styles.module.scss';

export const DeployUpgradeModalForm = (props: DeployUpgradeModalFormUIType) => {
  const {
    onSubmit,
    onClose,
    isUpgrade = false,
    isLoading,
    generalError,
    buttonText,
    successText,
    panelDescription,
    sessionId
  } = props;
  const {
    accountInfo,
    userActionsState,
    smartContract,
    networkConfig,
    customClassNames
  } = useSCExplorerContext();
  const { deployModalState } = userActionsState;
  const { deployedContractDetails, contractAddress } = smartContract ?? {};
  const { code } = deployModalState ?? {};
  const { isLoggedIn } = accountInfo;
  const { environment } = networkConfig;

  const metadataOptionsInitialValues = Object.fromEntries(
    Object.entries(METADATA_OPTIONS).map(([key, { checked }]) => [key, checked])
  );
  const initialValues: DeployUpgradeModalInitialValuesType = {
    [DeployModalFormikFieldsEnum.gasLimit]: SC_GAS_LIMIT,
    ...(metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType)
  };

  const validationSchema = object({
    gasLimit: string()
      .required('Required')
      .test('isValidNumber', 'Invalid Number', (value) =>
        Boolean(value && stringIsFloat(value))
      )
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => {
        const { errors, handleChange, handleBlur } = formik;
        const inputError = getIn(errors, DeployModalFormikFieldsEnum.gasLimit);

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.deployUpgradeModalForm)}
          >
            {panelDescription && (
              <div className={classNames(globalStyles?.formWarnPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(globalStyles?.formWarnPanelIcon)}
                />
                <div className={classNames(globalStyles?.formWarnPanelText)}>
                  {panelDescription}
                </div>
              </div>
            )}
            {/* TODO - temporary - don't send the transactions for now - show them in console on mainnet */}
            {environment === 'mainnet' && (
              <div className={classNames(globalStyles?.formWarnPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(globalStyles?.formWarnPanelIcon)}
                />
                <div className={classNames(globalStyles?.formWarnPanelText)}>
                  Temporary for testing. Transactions will not be sent on{' '}
                  <strong>mainnet</strong>. <br />
                  Check out the Console Panel for the Signed Transaction
                </div>
              </div>
            )}
            <div className={classNames(styles?.deployUpgradeModalFormFields)}>
              <div
                className={classNames(
                  styles?.deployUpgradeModalFormCodeMetadata
                )}
              >
                {Object.entries(METADATA_OPTIONS).map(([key, { label }]) => (
                  <label
                    className={styles?.deployUpgradeModalFormCodeMetadataLabel}
                    key={key}
                  >
                    <Field
                      type='checkbox'
                      name={key}
                      className={classNames(
                        styles?.deployUpgradeModalFormCodeMetadataField
                      )}
                    />
                    <span
                      className={classNames(
                        styles?.deployUpgradeModalFormCodeMetadataCheckmark
                      )}
                    ></span>
                    {label}
                  </label>
                ))}
              </div>

              <label
                htmlFor={DeployModalFormikFieldsEnum.gasLimit}
                className={globalStyles?.label}
              >
                Contract Transaction Gas Limit
              </label>
              <div
                className={classNames(
                  globalStyles?.inputGroup,
                  customClassNames?.inputGroupClassName
                )}
              >
                <Field
                  id={DeployModalFormikFieldsEnum.gasLimit}
                  name={DeployModalFormikFieldsEnum.gasLimit}
                  autoComplete='off'
                  type='text'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputMode='numeric'
                  placeholder='Gas Limit'
                  className={classNames(
                    globalStyles?.input,
                    customClassNames?.inputClassName,
                    { [globalStyles?.inputInvalid]: inputError },
                    {
                      ...(customClassNames?.inputInvalidClassName
                        ? {
                            [customClassNames.inputInvalidClassName]: inputError
                          }
                        : {})
                    }
                  )}
                />
                {inputError && typeof inputError === 'string' && (
                  <div
                    className={classNames(
                      globalStyles?.inputInvalidFeedback,
                      customClassNames?.inputInvalidFeedbackClassName
                    )}
                  >
                    {inputError}
                  </div>
                )}
              </div>
            </div>
            {generalError && (
              <div className={classNames(globalStyles?.generalError)}>
                <p>{String(generalError)}</p>
              </div>
            )}
            {!code && (
              <div className={classNames(globalStyles?.generalError)}>
                <p>Missing WASM File Code</p>
              </div>
            )}
            {Boolean(
              isUpgrade && !contractAddress && !deployedContractDetails
            ) && (
              <div className={classNames(globalStyles?.generalError)}>
                <p>Missing Contract Address</p>
              </div>
            )}
            <TransactionStatus
              onClose={onClose}
              isDisabled={Boolean(
                isLoading ||
                  !formik.isValid ||
                  !code ||
                  generalError ||
                  Boolean(
                    isUpgrade && !contractAddress && !deployedContractDetails
                  )
              )}
              isLoading={Boolean(isLoading)}
              buttonText={buttonText}
              successText={successText}
              sessionId={sessionId}
            />
          </Form>
        );
      }}
    </Formik>
  );
};
