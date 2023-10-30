import {
  GAS_PER_DATA_BYTE,
  EXTRA_GAS_LIMIT_GUARDED_TX
} from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';
import { SC_GAS_LIMIT } from 'constants/general';

interface CalculateGasLimitType {
  data: string;
  isGuarded?: boolean;
}

export const calculateGasLimit = ({
  data,
  isGuarded
}: CalculateGasLimitType) => {
  const guardedAccountGasLimit = isGuarded ? EXTRA_GAS_LIMIT_GUARDED_TX : 0;
  const bNconfigGasLimit = new BigNumber(SC_GAS_LIMIT).plus(
    guardedAccountGasLimit
  );
  const bNgasPerDataByte = new BigNumber(GAS_PER_DATA_BYTE);
  const bNgasValue = data
    ? bNgasPerDataByte.times(Buffer.from(data).length)
    : 0;
  const bNgasLimit = bNconfigGasLimit.plus(bNgasValue);
  const gasLimit = bNgasLimit.toString(10);

  return gasLimit;
};
