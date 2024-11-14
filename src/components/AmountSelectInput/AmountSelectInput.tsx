import React from 'react';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { getEgldLabel } from '@multiversx/sdk-dapp/utils/network/getEgldLabel';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { AmountSelect } from '@multiversx/sdk-dapp-form/UI/Fields/AmountSelect';
import {
  AmountErrorPropsType,
  MaxButtonPropsType,
  OptionType,
  TokenBalancePropsType,
  TokenSelectPropsType
} from '@multiversx/sdk-dapp-form/UI/Fields/AmountSelect/components';
import { AmountInputPropsType } from '@multiversx/sdk-dapp-form/UI/Fields/AmountSelect/components/AmountInput';
import classNames from 'classnames';

import { ZERO } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { AmountSelectInputUIType } from './types';

export const AmountSelectInputComponent = ({
  inputName,
  selectName,
  title,
  token,
  showMaxButton,
  tokenAmount,
  errorMessage,
  handleBlurSelect,
  optionsSelect,
  onChangeSelect,
  onBlurInput,
  onFocusSelect,
  tokenUsdPrice,
  hasErrors = false,
  handleChangeInput,
  isSelectLoading = false,
  isInputDisabled = false,
  balanceText = 'Available',
  inputPlaceholder = 'Amount',
  disabledOption,
  handleDisabledOptionClick,
  onMaxBtnClick,
  globalStyles,
  styles
}: AmountSelectInputUIType) => {
  const { customClassNames } = useSCExplorerContext();

  const generatedClasses = {
    group: classNames(styles?.amountSelectInputGroup),
    label: classNames(styles?.amountSelectInputLabel),
    small: classNames(styles?.amountSelectInputSmall),
    error: classNames(
      styles?.amountSelectInputError,
      globalStyles?.inputInvalidFeedback,
      customClassNames?.inputInvalidFeedbackClassName
    ),
    balance: classNames(styles?.amountSelectInputBalance),
    maxBtn: classNames(styles?.amountSelectInputMaxBtn),
    wrapper: classNames(styles?.amountSelectInputWrapper, {
      'is-invalid': hasErrors
    })
  };

  const tokenSelectProps: TokenSelectPropsType = {
    id: `id-select-${selectName}`,
    value: token as TokenSelectPropsType['value'],
    name: selectName,
    isLoading: isSelectLoading,
    options: optionsSelect as TokenSelectPropsType['options'],
    isSearchable: true,
    onChange: onChangeSelect,
    disabled: false,
    error: errorMessage,
    isInvalid: hasErrors,
    egldLabel: getEgldLabel(),
    chainId: getChainID(),
    className: '',
    showTokenPrice: false,
    showBalanceUsdValue: true,
    handleDisabledOptionClick,
    onFocus: onFocusSelect,
    onBlur: handleBlurSelect,
    disabledOption
  };

  const amountInputProps: AmountInputPropsType = {
    name: inputName,
    required: true,
    value: tokenAmount,
    placeholder: inputPlaceholder,
    handleBlur: onBlurInput,
    'data-testid': inputName,
    handleChange: handleChangeInput,
    usdPrice: Number(tokenUsdPrice),
    error: errorMessage,
    isInvalid: hasErrors,
    disabled: isInputDisabled
  };

  const amountErrorProps: AmountErrorPropsType = {
    hasErrors: amountInputProps.isInvalid || tokenSelectProps.isInvalid,
    error: amountInputProps.error || tokenSelectProps.error,
    className: generatedClasses.error,
    'data-testid': amountInputProps.error
      ? `${inputName}Error`
      : `${selectName}Error`
  };

  const tokenBalanceProps: TokenBalancePropsType = {
    'data-testid': `available-${token?.value}`,
    'data-value': `${token?.token.balance} ${token?.value}`,
    label: balanceText,
    token: token?.token as OptionType['token'],
    value: formatAmount({
      input: stringIsInteger(token?.token.balance ?? ZERO)
        ? token?.token.balance ?? ZERO
        : ZERO,
      decimals: token?.token.decimals,
      addCommas: true
    })
  };

  const maxButtonProps: MaxButtonPropsType = {
    token: token?.token,
    inputAmount: tokenAmount,
    onMaxClick: onMaxBtnClick,
    isMaxButtonVisible: showMaxButton,
    wrapperClassName: '',
    className: ''
  };

  return (
    <AmountSelect
      name={inputName}
      label={title}
      className={generatedClasses.group}
      wrapperControlsClassName={generatedClasses.wrapper}
      amountErrorProps={amountErrorProps}
      tokenSelectProps={tokenSelectProps}
      amountInputProps={amountInputProps}
      tokenBalanceProps={tokenBalanceProps}
      maxButtonProps={maxButtonProps}
    />
  );
};

export const AmountSelectInput = withStyles(AmountSelectInputComponent, {
  ssrStyles: () => import('components/AmountSelectInput/styles.module.scss'),
  clientStyles: () =>
    require('components/AmountSelectInput/styles.module.scss').default
});
