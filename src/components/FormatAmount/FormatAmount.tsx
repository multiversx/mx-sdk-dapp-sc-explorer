import React from 'react';

import {
  DECIMALS,
  DIGITS,
  FormatAmountController,
  MvxFormatAmount,
  MvxFormatAmountPropsType,
  useGetNetworkConfig
} from 'lib';
import { UserInterfaceType } from 'types';

interface IFormatAmountProps
  extends Partial<MvxFormatAmountPropsType>,
    UserInterfaceType {
  value: string;
}

export const FormatAmount = (props: IFormatAmountProps) => {
  const {
    network: { egldLabel }
  } = useGetNetworkConfig();

  const { isValid, valueDecimal, valueInteger, label } =
    FormatAmountController.getData({
      digits: DIGITS,
      decimals: DECIMALS,
      egldLabel,
      ...props,
      input: props.value
    });

  return (
    <MvxFormatAmount
      class={props.className}
      dataTestId={props['data-testid']}
      isValid={isValid}
      label={label}
      showLabel={props.showLabel}
      valueDecimal={valueDecimal}
      valueInteger={valueInteger}
    />
  );
};
