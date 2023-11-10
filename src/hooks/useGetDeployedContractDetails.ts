import { useSmartContractDispatch } from 'contexts';
import { useNetworkProvider } from 'hooks';
import { SmartContractDispatchTypeEnum } from 'types';

export const useGetDeployedContractDetails = () => {
  const smartContractDispatch = useSmartContractDispatch();
  const { get } = useNetworkProvider();

  const getDeployedContract = async ({ address }: { address: string }) => {
    const url = `accounts/${address}`;
    const response = await get({ url });
    if (response?.success && response?.data) {
      smartContractDispatch({
        type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
        deployedContractDetails: response.data
      });

      return response.data;
    }

    return;
  };

  return getDeployedContract;
};
