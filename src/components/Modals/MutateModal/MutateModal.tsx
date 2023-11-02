import React, { useState, useCallback } from 'react';
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
import { SC_GAS_LIMIT, ZERO } from 'constants/general';
import { useDispatch, useSCExplorerContext } from 'contexts';
import { getCallContractTransaction } from 'helpers';
import {
  ActionTypeEnum,
  SelectOptionType,
  ProcessedFormTokenType
} from 'types';
import { AmountSelectInput } from './AmountSelectInput';
import { getSelectOptions } from './AmountSelectInput/getSelectOptions';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

const optionTokensResponse: any[] = [];
export interface InitialValuesType {
  gasLimit: number;
  tokens: ProcessedFormTokenType[];
}

export const MutateModal = () => {
  const dispatch = useDispatch();
  const { accountInfo, smartContract, userActions, customClassNames, icons } =
    useSCExplorerContext();
  const { mutateModalState } = userActions;
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

  const initialValues: InitialValuesType = {
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

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setMutateModalState,
      mutateModalState: {
        mutateModalOpen: false,
        args: []
      }
    });
  }, []);

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

      const { error } = await sendTransactions({
        transactions: [contractTransaction],
        transactionsDisplayInfo: {
          processingMessage: 'Processing Transaction',
          errorMessage: 'An error has occured during Contract Mutation',
          successMessage: 'Contract Mutation Transaction successful'
        }
      });

      if (error) {
        setGeneralError(String(error));
      }

      dispatch({
        type: ActionTypeEnum.setMutateModalState,
        mutateModalState: {
          mutateModalOpen: false,
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
    tokens: optionTokensResponse,
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
          .required('Required')
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
          .required('Required')
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
              <div className={classNames(styles?.mutateModalWarnPanel)}>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size='2x'
                  className={classNames(styles?.mutateModalWarnPanelIcon)}
                />
                <div className={classNames(styles?.mutateModalWarnPanelText)}>
                  You are about to mutate the state of the Smart Contract.{' '}
                  <br />
                  Please make sure that the entered data is valid !
                </div>
              </div>
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
                            getIn(errors, tokenAmount) ||
                            getIn(errors, tokenIdentifier)
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
                              (getIn(errors, tokenIdentifier) &&
                                getIn(touched, tokenIdentifier))
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
                  customClassNames?.buttonClassName,
                  customClassNames?.buttonPrimaryClassName,
                  styles?.buttonEndpointAction,
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
