import { useState } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { isContract } from '@multiversx/sdk-dapp/utils/smartContracts';

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
    if (address && addressIsValid(address) && isContract(address)) {
      setIsContractAddressCheckLoading(true);
      const url = `accounts/${address}`;
      const response = await get({ url });
      setIsContractAddressCheckLoading(false);
      if (response?.success && response?.data?.code) {
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setContractAddress,
          contractAddress: address
        });
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
          deployedContractDetails: response.data
        });

        return;
      }
    }

    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setContractAddress,
      contractAddress: undefined
    });
    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
      deployedContractDetails: undefined
    });
  };

  return { updateDeployedContractDetails, isContractAddressCheckLoading };
};
