import {
  Address,
  SmartContract,
  QueryArguments,
  SmartContractQueryResponse
} from '@multiversx/sdk-core/out';
import { ContractQueryRequest } from '@multiversx/sdk-network-providers/out/contractQueryRequest';

import { useSCExplorerContext } from 'contexts';
import { useNetworkProvider } from 'hooks';

export const useQueryContract = () => {
  const { smartContract, networkConfig } = useSCExplorerContext();
  const { abiRegistry, contractAddress } = smartContract;
  const { post } = useNetworkProvider();

  const queryContract = async (props: QueryArguments) => {
    if (abiRegistry && contractAddress) {
      try {
        const address = new Address(contractAddress);
        const contract = new SmartContract({
          address,
          abi: abiRegistry
        });

        if (contract) {
          const query = contract?.createQuery(props);
          const request = new ContractQueryRequest(query).toHttpRequest();
          const response = await post({ request });

          if (response?.data) {
            try {
              const contractQueryResponse =
                SmartContractQueryResponse.fromHttpResponse(
                  response.data,
                  query.func.toString()
                );

              const endpoint = networkConfig.networkEntrypoint;
              const controller =
                endpoint.createSmartContractController(abiRegistry);
              const parsedResponse = controller.parseQueryResponse(
                contractQueryResponse
              );
              response.data['parsedResponse'] = parsedResponse;
            } catch {
              response.data['parsedResponse'] = undefined;
            }
          }

          return response;
        }
      } catch (error) {
        return {
          success: false,
          error: 'Unable to prepare SC Call'
        };
      }
    }

    if (!contractAddress) {
      return {
        success: false,
        error: 'Missing SC Address'
      };
    }

    return {
      success: false,
      error: 'Unable to call SC'
    };
  };

  return queryContract;
};
