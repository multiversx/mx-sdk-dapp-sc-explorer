import { TransactionOnNetwork } from '@multiversx/sdk-network-providers/out/transactions';

import { useNetworkProvider } from 'hooks';

export const useGetTransaction = () => {
  const { get } = useNetworkProvider();

  const getTransaction = async ({ hash }: { hash: string }) => {
    const url = `transactions/${hash}`;
    const response = await get({ url });
    if (response?.data) {
      console.log('1---api tx', response?.data);
      const transaction = TransactionOnNetwork.fromApiHttpResponse(
        response.data.hash,
        response.data
      );
      console.log('2---api tx', transaction);
      return transaction;
    }

    return;
  };

  return getTransaction;
};
