import { useEffect, useCallback } from 'react';
import { AbiRegistry } from '@multiversx/sdk-core/out';
import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';

import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useDispatch, useScContext } from 'context';
import { ActionTypeEnum, SCExplorerType } from 'types';

export const usePrepareSCState = (props: SCExplorerType) => {
  const {
    environment,
    networkConfig,
    allowMutate = false,
    abi,
    address,
    verifiedContract,
    provider
  } = props;

  const dispatch = useDispatch();
  const scState = useScContext();
  const {
    environment: stateEnvironment,
    networkConfig: stateNetworkConfig,
    ownerAddress: stateOwnerAddress,
    rawAbi: stateRawAbi,
    verifiedContract: stateVerifiedContract,
    abiRegistry: stateAbiRegistry,
    provider: stateProvider
  } = scState;

  const prepareState = useCallback(() => {
    if (environment !== stateEnvironment) {
      dispatch({
        type: ActionTypeEnum.setDappEnvironment,
        environment
      });
    }

    if (!stateNetworkConfig) {
      if (networkConfig) {
        dispatch({
          type: ActionTypeEnum.setNetworkConfig,
          networkConfig
        });
      } else {
        if (stateEnvironment) {
          const fallbackNetwork =
            fallbackNetworkConfigurations[stateEnvironment];
          console.info('No Network Config provided, using defaults');
          dispatch({
            type: ActionTypeEnum.setNetworkConfig,
            networkConfig: fallbackNetwork
          });
        }
      }
    } else {
      if (networkConfig?.id && networkConfig?.id !== stateNetworkConfig.id) {
        console.info('Network Setup Updated');
        dispatch({
          type: ActionTypeEnum.setNetworkConfig,
          networkConfig
        });
      }
    }

    if (provider !== stateProvider) {
      if (provider === 'proxy') {
        if (stateNetworkConfig?.proxyUrl) {
          dispatch({
            type: ActionTypeEnum.setProvider,
            provider
          });
        } else {
          console.info(
            'Missing proxyUrl from networkConfig for the proxy provider'
          );
        }
      }
    }

    if (stateNetworkConfig) {
      dispatch({
        type: ActionTypeEnum.setCanRead,
        canRead: true
      });
      if (allowMutate) {
        dispatch({
          type: ActionTypeEnum.setCanMutate,
          canMutate: true
        });
      }
    }

    if (!environment && !networkConfig) {
      dispatch({
        type: ActionTypeEnum.setCanRead,
        canRead: false
      });
      dispatch({
        type: ActionTypeEnum.setCanMutate,
        canMutate: false
      });
    }

    if (!allowMutate) {
      dispatch({
        type: ActionTypeEnum.setCanMutate,
        canMutate: false
      });
    }

    if (address && addressIsValid(address) && address !== stateOwnerAddress) {
      dispatch({
        type: ActionTypeEnum.setOwnerAddress,
        ownerAddress: address
      });
    }

    if (
      verifiedContract &&
      verifiedContract?.codeHash !== stateVerifiedContract?.codeHash
    ) {
      dispatch({
        type: ActionTypeEnum.setVerifiedContract,
        verifiedContract
      });
    }

    if (abi) {
      if (!abi.name) {
        abi.name = INTERFACE_NAME_PLACEHOLDER;
      }
      if (abi.name !== stateRawAbi?.name) {
        dispatch({
          type: ActionTypeEnum.setVerifiedContract,
          verifiedContract: undefined
        });
        dispatch({
          type: ActionTypeEnum.setAbiRegistry,
          abiRegistry: undefined
        });
        dispatch({
          type: ActionTypeEnum.setRawAbi,
          rawAbi: abi
        });
        dispatch({
          type: ActionTypeEnum.setCanView,
          canView: true
        });
      }
    }

    if (stateOwnerAddress && !abi && verifiedContract?.source?.abi) {
      const verifiedContractAbi = verifiedContract.source.abi;
      if (!verifiedContractAbi.name) {
        verifiedContractAbi.name = INTERFACE_NAME_PLACEHOLDER;
      }
      if (verifiedContractAbi.name !== stateRawAbi?.name) {
        dispatch({
          type: ActionTypeEnum.setAbiRegistry,
          abiRegistry: undefined
        });
        dispatch({
          type: ActionTypeEnum.setRawAbi,
          rawAbi: verifiedContractAbi
        });
        dispatch({
          type: ActionTypeEnum.setCanView,
          canView: true
        });
      }
    }

    if (stateRawAbi) {
      try {
        const abiRegistry = AbiRegistry.create(stateRawAbi);
        if (stateAbiRegistry?.name === abiRegistry.name) {
          return;
        }

        dispatch({
          type: ActionTypeEnum.setAbiRegistry,
          abiRegistry
        });
      } catch (error) {
        console.error('Unable to parse abi: ', error);
      }
    }
  }, [
    dispatch,
    environment,
    networkConfig,
    allowMutate,
    abi,
    address,
    verifiedContract,
    stateEnvironment,
    stateNetworkConfig,
    stateOwnerAddress,
    stateRawAbi,
    stateVerifiedContract,
    stateAbiRegistry
  ]);

  useEffect(prepareState, [prepareState]);
};
