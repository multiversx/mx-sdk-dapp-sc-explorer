import { Transaction } from 'lib/sdkCore';
import { EXTRA_GAS_LIMIT_GUARDED_TX } from '@multiversx/sdk-dapp/constants/index';
import BigNumber from 'bignumber.js';

import { SC_GAS_LIMIT, SC_DEPLOY_GAS_LIMIT } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { getComputedGasLimit } from 'helpers';
import { useNetworkProvider } from 'hooks';

export interface TransactionCostResponseType {
  gasLimit?: number;
  isVerified?: boolean;
}

export const useGetTransactionCost = ({
  isDeploy = false
}: {
  isDeploy?: boolean;
}) => {
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
        const bNGasLimit = new BigNumber(response.data.data.txGasUnits)
          .plus(SC_GAS_LIMIT)
          .plus(guardedAccountGasLimit);

        return { gasLimit: bNGasLimit.toNumber(), isVerified: true };
      }
    }

    const computedGasLimit = getComputedGasLimit({ transaction });
    if (computedGasLimit) {
      const computedbNGasLimit = new BigNumber(computedGasLimit)
        .plus(SC_GAS_LIMIT)
        .plus(guardedAccountGasLimit);

      const minGasLimit = new BigNumber(
        isDeploy ? SC_DEPLOY_GAS_LIMIT : SC_GAS_LIMIT
      );
      const returnGasLimit = computedbNGasLimit.isLessThan(minGasLimit)
        ? minGasLimit.toNumber()
        : computedbNGasLimit.toNumber();

      return { gasLimit: returnGasLimit, isVerified: false };
    }

    return {
      gasLimit: isDeploy ? SC_DEPLOY_GAS_LIMIT : SC_GAS_LIMIT,
      isVerified: false
    };
  };

  return getTransactionConst;
};
