import { ContractQueryRequest } from '@multiversx/sdk-core/out/networkProviders/contractQueryRequest';

import { useSCExplorerContext } from 'contexts';
import { useGetEntrypoint, useNetworkProvider } from 'hooks';
import {
  Address,
  QueryArguments,
  SmartContractQueryResponse
} from 'lib/sdkCore';

export const useQueryContract = () => {
  const { smartContract } = useSCExplorerContext();
  const { abiRegistry, contractAddress } = smartContract;
  const entrypoint = useGetEntrypoint();
  const { post } = useNetworkProvider();

  const queryContract = async (props: QueryArguments) => {
    const { func, args = [], value } = props;
    if (abiRegistry && contractAddress) {
      try {
        const address = new Address(contractAddress);
        const controller =
          entrypoint.createSmartContractController(abiRegistry);

        if (controller) {
          const query = controller.createQuery({
            contract: address,
            function: func.toString(),
            arguments: args,
            value
          });
          const requestnew = new ContractQueryRequest(query).toHttpRequest();
          const response = await post({ request: requestnew });

          if (response?.data) {
            try {
              const contractQueryResponse =
                SmartContractQueryResponse.fromHttpResponse(
                  response.data,
                  func.toString()
                );
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
        console.error('Contract Query Error:', error);
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
