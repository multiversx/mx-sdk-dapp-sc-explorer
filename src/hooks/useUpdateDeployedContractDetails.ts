import { useState } from 'react';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import { isContract } from '@multiversx/sdk-dapp/utils/smartContracts';

import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useSmartContractDispatch, useSCExplorerContext } from 'contexts';
import { getAbiRegistry } from 'helpers';
import { useNetworkProvider } from 'hooks';
import { SmartContractDispatchTypeEnum } from 'types';

export const useUpdateDeployedContractDetails = () => {
  const smartContractDispatch = useSmartContractDispatch();
  const { smartContract } = useSCExplorerContext();
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
      if (response?.success && response?.data?.code) {
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setContractAddress,
          contractAddress: address
        });
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
          deployedContractDetails: response.data
        });

        const isVerified = response.data.isVerified;
        const rawAbi = smartContract.rawAbi;

        if (isVerified && (!rawAbi || rawAbi?.isFromVerifiedContract)) {
          const url = `accounts/${address}/verification`;
          const response = await get({ url });
          const verifiedContractAbi = response?.data?.source?.abi;

          if (response?.success && verifiedContractAbi) {
            try {
              if (!verifiedContractAbi.name) {
                verifiedContractAbi.name = INTERFACE_NAME_PLACEHOLDER;
              }
              smartContractDispatch({
                type: SmartContractDispatchTypeEnum.setVerifiedContract,
                verifiedContract: response.data
              });
              smartContractDispatch({
                type: SmartContractDispatchTypeEnum.setRawAbi,
                rawAbi: { ...verifiedContractAbi, isFromVerifiedContract: true }
              });

              const abiRegistry = getAbiRegistry(verifiedContractAbi);
              smartContractDispatch({
                type: SmartContractDispatchTypeEnum.setAbiRegistry,
                abiRegistry
              });
            } catch (error) {
              console.error('Unable to parse Verified Contract ABI: ', error);
            }
            setIsContractAddressCheckLoading(false);

            return;
          }
        }

        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setVerifiedContract,
          verifiedContract: undefined
        });
        if (rawAbi?.isFromVerifiedContract) {
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setRawAbi,
            rawAbi: undefined
          });
          smartContractDispatch({
            type: SmartContractDispatchTypeEnum.setAbiRegistry,
            abiRegistry: undefined
          });
        }
        setIsContractAddressCheckLoading(false);

        return;
      }
    }

    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setVerifiedContract,
      verifiedContract: undefined
    });
    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setContractAddress,
      contractAddress: undefined
    });
    smartContractDispatch({
      type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
      deployedContractDetails: undefined
    });

    setIsContractAddressCheckLoading(false);
  };

  return {
    updateDeployedContractDetails,
    isContractAddressCheckLoading
  };
};
