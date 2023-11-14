import React, { useState } from 'react';
import {
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { array, object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { AmountSelectInput } from 'components';
import { SC_GAS_LIMIT, ZERO } from 'constants/general';
import { useUserActionDispatch, useSCExplorerContext } from 'contexts';
import { getCallContractTransaction, getSelectOptions } from 'helpers';
import {
  UserActionDispatchTypeEnum,
  SelectOptionType,
  ProcessedFormTokenType
} from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export interface MutateModalInitialValuesType {
  gasLimit: number;
  tokens: ProcessedFormTokenType[];
}

export const MutateModal = () => {
  const userActionDispatch = useUserActionDispatch();
  const {
    networkConfig,
    accountInfo,
    smartContract,
    userActionsState,
    customClassNames,
    icons
  } = useSCExplorerContext();
  const { environment } = networkConfig;
  const { mutateModalState, accountTokens } = userActionsState;
  const { mutateModalOpen = false, args, endpoint } = mutateModalState ?? {};
  const {
    isLoggedIn,
    address: callerAddress,
    balance: egldBalance
  } = accountInfo;
  const { modifiers } = endpoint ?? {};
  const { abiRegistry, contractAddress } = smartContract;
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<SelectOptionType>();

  const initialValues: MutateModalInitialValuesType = {
    gasLimit: SC_GAS_LIMIT,
    tokens: modifiers?.isPayable()
      ? [
          {
            tokenAmount: '',
            tokenIdentifier: '',
            tokenDecimals: DECIMALS,
            tokenType: '',
            tokenNonce: 0
          }
        ]
      : []
  };

  const onClose = () => {
    userActionDispatch({
      type: UserActionDispatchTypeEnum.setMutateModalState,
      mutateModalState: {
        endpoint: undefined,
        mutateModalOpen: false,
        args: []
      }
    });
  };

  const onSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);
      const contractTransaction = getCallContractTransaction({
        contractAddress,
        callerAddress,
        abiRegistry,
        func: endpoint?.name,
        args,
        userGasLimit: values.gasLimit,
        tokens: values.tokens
      });

      console.log('Transaction: ', contractTransaction?.toPlainObject());

      // TODO - temporary - don't send the transactions for now - show them in console on mainnet
      const { error } = await sendTransactions({
        ...(environment === 'mainnet' ? { signWithoutSending: true } : {}),
        transactions: [contractTransaction],
        transactionsDisplayInfo: {
          processingMessage: `Processing ${endpoint?.name} Transaction`,
          errorMessage: `An error has occured during ${endpoint?.name} Transaction`,
          successMessage: `${endpoint?.name} Transaction successful`
        }
      });

      if (error) {
        setGeneralError(String(error));
      }

      userActionDispatch({
        type: UserActionDispatchTypeEnum.setMutateModalState,
        mutateModalState: {
          mutateModalOpen: false,
          endpoint: undefined,
          args: []
        }
      });
    } catch (error) {
      console.error('Send Contract Mutation Error:', error);
      setGeneralError(String(error));
    } finally {
      setIsLoading(false);
    }
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

  if (!(isLoggedIn && endpoint && args)) {
    return null;
  }

  return (
    <Modal
      show={mutateModalOpen}
      onClose={onClose}
      className={styles?.mutateModal}
      title='Setup Write Contract Transaction'
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={true}
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
          const inputError = getIn(errors, 'gasLimit');

          return (
            <Form
              onSubmit={formik.handleSubmit}
              className={classNames(styles?.mutateModalForm)}
            >
              <div className={classNames(globalStyles?.formWarnPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(globalStyles?.formWarnPanelIcon)}
                />
                <div className={classNames(globalStyles?.formWarnPanelText)}>
                  This is a real transaction that will be executed on the Smart
                  Contract. <br />
                  Please make sure that the entered data is valid !
                </div>
              </div>
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
              <div className={classNames(styles?.mutateModalFormFields)}>
                <label htmlFor='gasLimit' className={globalStyles?.label}>
                  Contract Transaction Gas Limit
                </label>
                <div
                  className={classNames(
                    globalStyles?.inputGroup,
                    customClassNames?.inputGroupClassName
                  )}
                >
                  <Field
                    id='gasLimit'
                    name='gasLimit'
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
                              [customClassNames.inputInvalidClassName]:
                                inputError
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
                {modifiers?.isPayable() && (
                  <>
                    {values.tokens.map((token, index) => {
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
                    })}
                  </>
                )}
              </div>
              {generalError && (
                <div className={classNames(globalStyles?.generalError)}>
                  <p>{String(generalError)}</p>{' '}
                </div>
              )}
              <button
                className={classNames(
                  globalStyles?.button,
                  globalStyles?.buttonPrimary,
                  globalStyles?.buttonAction,
                  customClassNames?.buttonClassName,
                  customClassNames?.buttonPrimaryClassName,
                  styles?.mutateModalFormButton
                )}
                type='submit'
                {...(isLoading || !formik.isValid ? { disabled: true } : {})}
              >
                Send Transaction
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
    </Modal>
  );
};
