import React, { useEffect, useState } from 'react';
import {
  faPlay,
  faCircleNotch,
  faCircleCheck,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import classNames from 'classnames';
import { Form, Field, getIn } from 'formik';

import { AmountSelectInput } from 'components';
import { SC_GAS_LIMIT, SC_DEPLOY_GAS_LIMIT, ZERO } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { getSelectOptions } from 'helpers';
import { withStyles } from 'hocs/withStyles';
import { useGetTransactionCostDetails } from 'hooks';
import {
  InteractionFormContentUIType,
  InteractionModalFormikFieldsEnum,
  MutateModalInitialValuesType,
  ProcessedFormTokenType,
  DataTestIdsEnum
} from 'types';

export const InteractionFormContentComponent = (
  props: InteractionFormContentUIType
) => {
  const {
    isUpgrade = false,
    isDeploy = false,
    isMutate = false,
    isLoading,
    generalError,
    buttonText,
    panelDescription,
    code,
    endpoint,
    args,
    tokens,
    globalStyles,
    styles,
    formik
  } = props;
  const { accountInfo, smartContract, icons, customClassNames } =
    useSCExplorerContext();

  const getTransactionCostDetails = useGetTransactionCostDetails({
    isDeploy,
    isMutate,
    isUpgrade,
    args,
    endpoint,
    code
  });
  const { deployedContractDetails, contractAddress } = smartContract ?? {};

  const { modifiers } = endpoint ?? {};
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};
  const { isLoggedIn, balance: egldBalance } = accountInfo;
  const [isTxCostLoading, setIsTxCostLoading] = useState(false);
  const [hasVerifiedGasLimit, setHasVerifiedTxGasLimit] = useState<
    boolean | undefined
  >();

  const defaultGasLimit = isMutate ? SC_GAS_LIMIT : SC_DEPLOY_GAS_LIMIT;

  const tokenList = getSelectOptions({
    tokens,
    includeEgld: modifiers?.isPayableInEGLD(),
    egldBalance
  });

  const { errors, touched, values, setFieldValue, handleChange, handleBlur } =
    formik;
  const inputError = getIn(errors, InteractionModalFormikFieldsEnum.gasLimit);
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
        (isUpgrade || isMutate) && !contractAddress && !deployedContractDetails
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
      const transactionGasLimit = await getTransactionCostDetails({
        tokens
      });
      if (transactionGasLimit) {
        const { gasLimit, isVerified } = transactionGasLimit;
        setFieldValue(InteractionModalFormikFieldsEnum.gasLimit, gasLimit);
        setHasVerifiedTxGasLimit(isVerified);
      } else {
        setFieldValue(
          InteractionModalFormikFieldsEnum.gasLimit,
          defaultGasLimit
        );
        setHasVerifiedTxGasLimit(false);
      }
      setIsTxCostLoading(false);
    };

    if (
      validTokens &&
      !isGasValueTouched &&
      hasVerifiedGasLimit === undefined
    ) {
      fetchData().catch(console.error);
    }
  }, [values, hasVerifiedGasLimit]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={classNames(styles?.interactionForm)}
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
      <div className={classNames(styles?.interactionFormFields)}>
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
            (isTxCostLoading || hasVerifiedGasLimit) && !isGasValueTouched
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
                  {hasVerifiedGasLimit && (
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
                  (token) => token.value === getIn(values, tokenIdentifier)
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
                        setFieldValue(tokenAmount, event.currentTarget.value);
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
                      if (option?.value !== undefined) {
                        setFieldValue(tokenAmount, '');
                        setFieldValue(tokenIdentifier, option?.value);
                        setFieldValue(
                          tokenDecimals,
                          option?.token?.decimals ?? DECIMALS
                        );
                        setFieldValue(tokenType, option?.token?.type ?? '');
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

      {Boolean(isMutate && !contractAddress && !deployedContractDetails) && (
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
          styles?.interactionFormButton
        )}
        type='submit'
        data-testid={DataTestIdsEnum.interactionFormBtn}
        {...(isButtonDisabled ? { disabled: true } : {})}
      >
        {buttonText}
        {isLoading ? (
          <FontAwesomeIcon icon={loadIcon} className='fa-spin fast-spin' />
        ) : (
          <FontAwesomeIcon icon={playIcon} />
        )}
      </button>
    </Form>
  );
};

export const InteractionFormContent = withStyles(
  InteractionFormContentComponent,
  {
    ssrStyles: () =>
      import('components/Forms/InteractionForm/styles.module.scss'),
    clientStyles: () =>
      require('components/Forms/InteractionForm/styles.module.scss').default
  }
);
