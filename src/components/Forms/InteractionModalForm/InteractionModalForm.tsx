import React, { useEffect, useState } from 'react';
import {
  faPlay,
  faCircleNotch,
  faCircleCheck,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transaction } from '@multiversx/sdk-core/out';
import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { array, object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { AmountSelectInput } from 'components';
import {
  SC_GAS_LIMIT,
  SC_DEPLOY_GAS_LIMIT,
  SC_SIMULATE_GAS_LIMIT,
  METADATA_OPTIONS,
  ZERO
} from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import {
  getSelectOptions,
  getCallContractTransaction,
  getDeployTransaction,
  getUpgradeTransaction
} from 'helpers';
import { useGetTransactionCost } from 'hooks';
import {
  MetadataFieldsInitialValuesType,
  InteractionModalFormUIType,
  InteractionModalFormikFieldsEnum,
  MutateModalInitialValuesType,
  SelectOptionType,
  ProcessedFormTokenType,
  DataTestIdsEnum
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
    icons,
    customClassNames
  } = useSCExplorerContext();
  const getTransactionCost = useGetTransactionCost();
  const { deployedContractDetails, abiRegistry, contractAddress } =
    smartContract ?? {};
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

  const { code, endpoint, args } = currentModalState ?? {};
  const { modifiers } = endpoint ?? {};
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};
  const {
    isLoggedIn,
    balance: egldBalance,
    address: callerAddress,
    nonce
  } = accountInfo;
  const [selectedToken, setSelectedToken] = useState<SelectOptionType>();
  const [isTxCostLoading, setIsTxCostLoading] = useState(false);
  const [simulatedTxGasLimit, setSimulatedTxGasLimit] = useState<
    number | undefined
  >();

  const metadataOptionsInitialValues =
    isDeploy || isUpgrade
      ? Object.fromEntries(
          Object.entries(METADATA_OPTIONS).map(([key, { checked }]) => [
            key,
            checked
          ])
        )
      : {};

  const defaultGasLimit = isMutate ? SC_GAS_LIMIT : SC_DEPLOY_GAS_LIMIT;

  const initialValues = {
    [InteractionModalFormikFieldsEnum.gasLimit]: defaultGasLimit,
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

  const getTransactionCostDetails = async ({
    tokens
  }: {
    tokens?: ProcessedFormTokenType[];
  }) => {
    let transaction: Transaction | undefined = undefined;
    if (isMutate) {
      transaction = getCallContractTransaction({
        contractAddress,
        callerAddress,
        abiRegistry,
        func: endpoint?.name,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        tokens,
        nonce
      });
    }
    if (isDeploy && code) {
      transaction = getDeployTransaction({
        callerAddress,
        abiRegistry,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        code,
        metadata:
          metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType,
        nonce
      });
    }
    if (isUpgrade && code && contractAddress) {
      transaction = getUpgradeTransaction({
        contractAddress,
        callerAddress,
        abiRegistry,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        code,
        metadata:
          metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType,
        nonce
      });
    }

    if (transaction) {
      const gasLimit = await getTransactionCost(transaction);
      if (gasLimit) {
        return gasLimit;
      }
    }

    return;
  };

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
        const isGasValueTouched = getIn(
          touched,
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

        useEffect(() => {
          const tokens = getIn(values, InteractionModalFormikFieldsEnum.tokens);

          const validTokens =
            tokens && tokens.length > 0
              ? tokens.every((token: ProcessedFormTokenType) =>
                  Boolean(token.tokenIdentifier && token.tokenAmount !== '')
                )
              : true;

          const fetchData = async () => {
            setIsTxCostLoading(true);
            const gasLimit = await getTransactionCostDetails({
              tokens
            });
            if (gasLimit) {
              setFieldValue(
                InteractionModalFormikFieldsEnum.gasLimit,
                gasLimit
              );
              setSimulatedTxGasLimit(gasLimit);
            } else {
              setFieldValue(
                InteractionModalFormikFieldsEnum.gasLimit,
                defaultGasLimit
              );
              setSimulatedTxGasLimit(0);
            }
            setIsTxCostLoading(false);
          };

          if (
            validTokens &&
            !isGasValueTouched &&
            simulatedTxGasLimit === undefined
          ) {
            fetchData().catch(console.error);
          }
        }, [values, simulatedTxGasLimit]);

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(styles?.interactionModalForm)}
          >
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
                        data-testid={`${DataTestIdsEnum.prefix}checkbox-${key}`}
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
                  data-testid={DataTestIdsEnum.interactionFormInput}
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
                {Boolean(
                  (isTxCostLoading || simulatedTxGasLimit) && !isGasValueTouched
                ) && (
                  <div
                    className={classNames(
                      globalStyles?.inputGroupAppend,
                      globalStyles?.inputGroupAppendIcon,
                      customClassNames?.inputGroupAppendClassName
                    )}
                  >
                    {isTxCostLoading ? (
                      <FontAwesomeIcon
                        icon={loadIcon}
                        className='fa-spin fast-spin'
                      />
                    ) : (
                      <>
                        {simulatedTxGasLimit && (
                          <FontAwesomeIcon icon={faCircleCheck} />
                        )}
                      </>
                    )}
                  </div>
                )}
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
            {(isUpgrade || isDeploy) && !abiRegistry && (
              <div className={classNames(globalStyles?.generalWarning)}>
                <p>
                  Missing or Invalid ABI File: The deploy transaction will not
                  include parameters!
                </p>
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
              data-testid={DataTestIdsEnum.interactionFormBtn}
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
