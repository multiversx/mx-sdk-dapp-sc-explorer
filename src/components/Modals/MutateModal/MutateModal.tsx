import React, { useState, useCallback } from 'react';

import {
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { lazy, mixed, object } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { SC_GAS_LIMIT } from 'constants/general';
import { useDispatch, useSCExplorerContext } from 'contexts';
import { getCallContractTransaction } from 'helpers';
import { ActionTypeEnum } from 'types';
import styles from './styles.module.scss';
import { Modal } from '../Modal';

export const MutateModal = () => {
  const dispatch = useDispatch();
  const { accountInfo, smartContract, userActions, customClassNames, icons } =
    useSCExplorerContext();
  const { mutateModalState } = userActions;
  const { mutateModalOpen = false, args, endpoint } = mutateModalState ?? {};
  const { isLoggedIn, address: callerAddress, isGuarded } = accountInfo;
  const { abiRegistry, contractAddress } = smartContract;
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>();

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setMutateModalState,
      mutateModalState: {
        mutateModalOpen: false,
        args: []
      }
    });
  }, []);

  const initialTransaction = getCallContractTransaction({
    contractAddress,
    callerAddress,
    abiRegistry,
    func: endpoint?.name,
    args,
    isGuarded
  });

  if (!(isLoggedIn && endpoint && args && args?.length > 0)) {
    return null;
  }

  const initialValues = {
    gasLimit: initialTransaction?.getGasLimit()?.valueOf() ?? SC_GAS_LIMIT
  };

  return (
    <Modal
      show={mutateModalOpen}
      onClose={onClose}
      className={styles?.mutateModal}
      title='Setup Write Contract Transaction'
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            setIsLoading(true);
            const contractTransaction = getCallContractTransaction({
              contractAddress,
              callerAddress,
              abiRegistry,
              func: endpoint?.name,
              args,
              isGuarded,
              userGasLimit: values.gasLimit
            });

            console.log(
              '+++ Transaction',
              contractTransaction?.toPlainObject()
            );

            const { sessionId, error } = await sendTransactions({
              // signWithoutSending: true,
              transactions: [contractTransaction],
              transactionsDisplayInfo: {
                processingMessage: 'Processing Transaction',
                errorMessage: 'An error has occured during Contract Mutation',
                successMessage: 'Contract Mutation Transaction successful'
              }
            });
            console.log('Tx sessionId, error', sessionId, error);

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
        }}
        //validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {(formik) => {
          const inputError = getIn(formik.errors, 'gasLimit');
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    inputMode='numeric'
                    placeholder='Gas Limit'
                    className={classNames(
                      globalStyles?.input,
                      customClassNames?.inputClassName,
                      { [globalStyles?.inputInvalid]: formik.errors },
                      {
                        ...(customClassNames?.inputInvalidClassName
                          ? {
                              [customClassNames.inputInvalidClassName]:
                                formik.errors
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
