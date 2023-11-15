import React from 'react';
import {
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
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
    isUpgrade = false,
    isLoading,
    generalError,
    buttonText,
    panelDescription
  } = props;
  const {
    accountInfo,
    userActionsState,
    smartContract,
    networkConfig,
    icons,
    customClassNames
  } = useSCExplorerContext();
  const { deployedContractDetails, contractAddress } = smartContract ?? {};
  const { deployModalState, upgradeModalState } = userActionsState;
  const { code } = isUpgrade ? upgradeModalState ?? {} : deployModalState ?? {};
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};
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
      onSubmit={async (values, { resetForm }) => {
        await onSubmit(values);
        resetForm();
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => {
        const { errors, handleChange, handleBlur } = formik;
        const inputError = getIn(errors, DeployModalFormikFieldsEnum.gasLimit);
        const isButtonDisabled = Boolean(
          isLoading ||
            !formik.isValid ||
            !code ||
            generalError ||
            Boolean(isUpgrade && !contractAddress && !deployedContractDetails)
        );

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.deployUpgradeModalForm)}
          >
            {/* TODO - temporary - don't send the transactions for now - show them in console on mainnet */}
            {environment === 'mainnet' && (
              <div className={classNames(globalStyles?.formPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(
                    globalStyles?.formPanelIcon,
                    globalStyles?.formPanelIconWarn
                  )}
                />
                <div className={classNames(globalStyles?.formPanelText)}>
                  Temporary for testing. Transactions will not be sent on{' '}
                  <strong>mainnet</strong>. <br />
                  Check out the Console Panel for the Signed Transaction
                </div>
              </div>
            )}

            {panelDescription && (
              <div className={classNames(globalStyles?.formPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(
                    globalStyles?.formPanelIcon,
                    globalStyles?.formPanelIconWarn
                  )}
                />
                <div className={classNames(globalStyles?.formPanelText)}>
                  {panelDescription}
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
            <button
              className={classNames(
                globalStyles?.button,
                globalStyles?.buttonPrimary,
                globalStyles?.buttonAction,
                customClassNames?.buttonClassName,
                customClassNames?.buttonPrimaryClassName,
                styles?.deployUpgradeModalFormButton
              )}
              type='submit'
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
          </Form>
        );
      }}
    </Formik>
  );
};
