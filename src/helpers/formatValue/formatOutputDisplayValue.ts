import { BigNumber } from 'bignumber.js';

export const formatOutputDisplayValue = (value: any) => {
  try {
    if (
      typeof value === 'number' ||
      !isNaN(Number(value)) ||
      BigNumber.isBigNumber(value)
    ) {
      const bNValue = new BigNumber(value);
      if (!bNValue.isNaN()) {
        return bNValue.toFixed();
      }
    }

    return value;
  } catch (error) {
    return value;
  }
};
