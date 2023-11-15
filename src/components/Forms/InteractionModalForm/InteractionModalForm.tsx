import React, { useState } from 'react';
import {
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { array, object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { AmountSelectInput } from 'components';
import { SC_GAS_LIMIT, METADATA_OPTIONS, ZERO } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { getSelectOptions } from 'helpers';
import {
  MetadataFieldsInitialValuesType,
  InteractionModalFormUIType,
  InteractionModalFormikFieldsEnum,
  MutateModalInitialValuesType,
  SelectOptionType
} from 'types';
import styles from './styles.module.scss';

export const InteractionModalForm = (props: InteractionModalFormUIType) => {
  const {
    onSubmit,
    isUpgrade = false,
    isDeploy = false,
    isMutate = false,
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
  const {
    deployModalState,
    upgradeModalState,
    mutateModalState,
    accountTokens
  } = userActionsState;

  const currentModalState =
    (isUpgrade && upgradeModalState ? upgradeModalState : undefined) ||
    (isDeploy && deployModalState ? deployModalState : undefined) ||
    (isMutate && mutateModalState ? mutateModalState : undefined);

  const { code, endpoint } = currentModalState ?? {};
  const { modifiers } = endpoint ?? {};
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};
  const { isLoggedIn, balance: egldBalance } = accountInfo;
  const { environment } = networkConfig;
  const [selectedToken, setSelectedToken] = useState<SelectOptionType>();

  const metadataOptionsInitialValues =
    isDeploy || isUpgrade
      ? Object.fromEntries(
          Object.entries(METADATA_OPTIONS).map(([key, { checked }]) => [
            key,
            checked
          ])
        )
      : {};

  const initialValues = {
    [InteractionModalFormikFieldsEnum.gasLimit]: SC_GAS_LIMIT,
    [InteractionModalFormikFieldsEnum.tokens]:
      isMutate && modifiers?.isPayable()
        ? [
            {
              tokenAmount: '',
              tokenIdentifier: '',
              tokenDecimals: DECIMALS,
              tokenType: '',
              tokenNonce: 0
            }
          ]
        : [],
    ...(metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType)
  };

  const tokenList = getSelectOptions({
    tokens: accountTokens,
    includeEgld: modifiers?.isPayableInEGLD(),
    egldBalance
  });

  const validationSchema = object({
    gasLimit: string()
      .required('Required')
      .test('isValidNumber', 'Invalid Number', (value) =>
        Boolean(value && stringIsFloat(value))
      ),
    tokens: array().of(
      object().shape({
        tokenAmount: string()
          .required('Amount Required')
          .test('isValidNumber', 'Invalid Number', (value) =>
            Boolean(value && stringIsFloat(value))
          )
          .test('hasFunds', 'Insufficient funds', (value) => {
            if (value && selectedToken?.token !== undefined) {
              const parsedAmount = parseAmount(
                value.toString(),
                selectedToken.token.decimals
              );
              const bnAmount = new BigNumber(parsedAmount);
              const bnBalance = new BigNumber(
                selectedToken.token.balance ?? '0'
              );
              return bnBalance.comparedTo(bnAmount) >= 0;
            }
            return true;
          }),
        tokenIdentifier: string()
          .required('Token Required')
          .test('tokenIdentifier', 'Invalid Token', (value) => {
            if (tokenList.length > 0) {
              return tokenList.some((token) => token.value === value);
            }
            return true;
          })
      })
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
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => {
        const {
          errors,
          touched,
          values,
          setFieldValue,
          handleChange,
          handleBlur
        } = formik;
        const inputError = getIn(
          errors,
          InteractionModalFormikFieldsEnum.gasLimit
        );
        const isButtonDisabled = Boolean(
          isLoading ||
            !formik.isValid ||
            generalError ||
            Boolean((isUpgrade || isDeploy) && !code) ||
            Boolean(
              (isUpgrade || isMutate) &&
                !contractAddress &&
                !deployedContractDetails
            )
        );

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.interactionModalForm)}
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
            <div className={classNames(styles?.interactionModalFormFields)}>
              {(isDeploy || isUpgrade) && (
                <div
                  className={classNames(
                    styles?.interactionModalFormCodeMetadata
                  )}
                >
                  {Object.entries(METADATA_OPTIONS).map(([key, { label }]) => (
                    <label
                      className={styles?.interactionModalFormCodeMetadataLabel}
                      key={key}
                    >
                      <Field
                        type='checkbox'
                        name={key}
                        className={classNames(
                          styles?.interactionModalFormCodeMetadataField
                        )}
                      />
                      <span
                        className={classNames(
                          styles?.interactionModalFormCodeMetadataCheckmark
                        )}
                      ></span>
                      {label}
                    </label>
                  ))}
                </div>
              )}
              <label
                htmlFor={InteractionModalFormikFieldsEnum.gasLimit}
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
                  id={InteractionModalFormikFieldsEnum.gasLimit}
                  name={InteractionModalFormikFieldsEnum.gasLimit}
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
              {isMutate && modifiers?.isPayable() && (
                <>
                  {(values as MutateModalInitialValuesType).tokens.map(
                    (token, index) => {
                      const prefix = `tokens.${index}`;
                      const tokenAmount = `${prefix}.tokenAmount`;
                      const tokenIdentifier = `${prefix}.tokenIdentifier`;
                      const tokenDecimals = `${prefix}.tokenDecimals`;
                      const tokenType = `${prefix}.tokenType`;
                      const tokenNonce = `${prefix}.tokenNonce`;
                      const activeToken = tokenList.find(
                        (token) =>
                          token.value === getIn(values, tokenIdentifier)
                      );
                      return (
                        <AmountSelectInput
                          key={index}
                          errorMessage={
                            getIn(errors, tokenIdentifier) ||
                            getIn(errors, tokenAmount)
                          }
                          handleBlurSelect={handleBlur}
                          handleChangeInput={(event) => {
                            if (event?.currentTarget?.value !== undefined) {
                              setFieldValue(
                                tokenAmount,
                                event.currentTarget.value
                              );
                            }
                          }}
                          hasErrors={Boolean(
                            (getIn(errors, tokenAmount) &&
                              getIn(touched, tokenAmount)) ||
                              getIn(errors, tokenIdentifier)
                          )}
                          inputName={tokenAmount}
                          inputPlaceholder='Amount'
                          isInputDisabled={false}
                          isSelectLoading={false}
                          onBlurInput={handleBlur}
                          onChangeSelect={(option) => {
                            setSelectedToken(option);
                            if (option?.value !== undefined) {
                              setFieldValue(tokenAmount, '');
                              setFieldValue(tokenIdentifier, option?.value);
                              setFieldValue(
                                tokenDecimals,
                                option?.token?.decimals ?? DECIMALS
                              );
                              setFieldValue(
                                tokenType,
                                option?.token?.type ?? ''
                              );
                              if (option?.token?.nonce) {
                                setFieldValue(tokenNonce, option.token.nonce);
                              }
                            }
                          }}
                          onMaxBtnClick={(value) => {
                            setFieldValue(tokenAmount, value);
                          }}
                          optionsSelect={tokenList}
                          selectName={`${prefix}.selectAmount`}
                          showMaxButton
                          title='You send'
                          token={activeToken}
                          tokenAmount={getIn(values, tokenAmount)}
                          tokenUsdPrice={activeToken?.token?.price ?? ZERO}
                        />
                      );
                    }
                  )}
                </>
              )}
            </div>
            {generalError && (
              <div className={classNames(globalStyles?.generalError)}>
                <p>{String(generalError)}</p>
              </div>
            )}
            {(isUpgrade || isDeploy) && !code && (
              <div className={classNames(globalStyles?.generalError)}>
                <p>Missing WASM File Code</p>
              </div>
            )}
            {Boolean(
              (isUpgrade || isMutate) &&
                !contractAddress &&
                !deployedContractDetails
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
                styles?.interactionModalFormButton
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
