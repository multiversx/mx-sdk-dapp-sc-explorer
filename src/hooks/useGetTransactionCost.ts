import { Transaction } from '@multiversx/sdk-core/out';
import { EXTRA_GAS_LIMIT_GUARDED_TX } from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';

import { useSCExplorerContext } from 'contexts';
import { useNetworkProvider } from 'hooks';

export const useGetTransactionCost = () => {
  const { post } = useNetworkProvider();
  const { accountInfo } = useSCExplorerContext();
  const { isGuarded } = accountInfo;
  const guardedAccountGasLimit = isGuarded ? EXTRA_GAS_LIMIT_GUARDED_TX : 0;

  const getTransactionConst = async (transaction: Transaction) => {
    const url = 'transaction/cost';
    const response = await post({ url, request: transaction.toSendable() });
    if (response?.data && response.success) {
      if (
        response.data?.code === 'successful' &&
        response.data?.data?.txGasUnits
      ) {
        const bNGasLimit = new BigNumber(response.data.data.txGasUnits).plus(
          guardedAccountGasLimit
        );

        return bNGasLimit.toNumber();
      }
    }

    return;
  };

  return getTransactionConst;
};
