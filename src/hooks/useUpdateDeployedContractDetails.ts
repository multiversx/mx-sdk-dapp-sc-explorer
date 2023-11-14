import { useState } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';

import { useSmartContractDispatch } from 'contexts';
import { useNetworkProvider } from 'hooks';
import { SmartContractDispatchTypeEnum } from 'types';

export const useUpdateDeployedContractDetails = () => {
  const smartContractDispatch = useSmartContractDispatch();
  const { get } = useNetworkProvider();
  const [isContractAddressCheckLoading, setIsContractAddressCheckLoading] =
    useState(false);

  const updateDeployedContractDetails = async ({
    address
  }: {
    address: string;
  }) => {
    if (address && addressIsValid(address)) {
      const url = `accounts/${address}`;
      const response = await get({ url });
      if (response?.success && response?.data) {
        setIsContractAddressCheckLoading(true);
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setContractAddress,
          contractAddress: address
        });
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
          deployedContractDetails: response.data
        });
        setIsContractAddressCheckLoading(false);
      } else {
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setContractAddress,
          contractAddress: undefined
        });
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
          deployedContractDetails: undefined
        });
        return response.data;
      }
    }

    return;
  };

  return { updateDeployedContractDetails, isContractAddressCheckLoading };
};
