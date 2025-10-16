import { useNetworkProvider } from 'hooks';
import { TransactionOnNetwork } from 'lib/sdkCore';

export const useGetTransaction = () => {
  const { get } = useNetworkProvider();

  const getTransaction = async ({ hash }: { hash: string }) => {
    const url = `transactions/${hash}`;
    const response = await get({ url });
    if (response?.data) {
      const transaction = TransactionOnNetwork.fromApiHttpResponse(
        response.data.hash,
        response.data
      );

      return transaction;
    }

    return;
  };

  return getTransaction;
};
