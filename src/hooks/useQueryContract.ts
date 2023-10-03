import {
  Address,
  SmartContract,
  QueryArguments,
  ResultsParser
} from '@multiversx/sdk-core/out';

import { ContractQueryRequest } from '@multiversx/sdk-network-providers/out/contractQueryRequest';
import { ContractQueryResponse } from '@multiversx/sdk-network-providers/out/contractQueryResponse';

import { useScContext } from 'context';
import { useNetworkProvider } from 'hooks';

export const useQueryContract = () => {
  const { abiRegistry, ownerAddress } = useScContext();
  const { post } = useNetworkProvider();

  const queryContract = async (props: QueryArguments) => {
    if (abiRegistry && ownerAddress) {
      try {
        const address = new Address(ownerAddress);
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
                ContractQueryResponse.fromHttpResponse(response.data);
              const endpoint = abiRegistry.getEndpoint(props?.func?.toString());
              const parsedResponse = new ResultsParser().parseQueryResponse(
                contractQueryResponse,
                endpoint
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

    return {
      success: false
    };
  };

  return queryContract;
};
