import {
  Address,
  SmartContract,
  IContractFunction,
  TypedValue
} from '@multiversx/sdk-core/out';
import { useScContext } from 'context';

export interface CallContractProps {
  func: IContractFunction;
  args?: TypedValue[];
}

export const useCallContract = () => {
  const { abiRegistry, ownerAddress } = useScContext();

  const callContract = async (props: CallContractProps) => {
    if (abiRegistry && ownerAddress) {
      try {
        const address = new Address(ownerAddress);
        const contract = new SmartContract({
          address,
          abi: abiRegistry
        });

        if (contract) {
          // const { func, args } = props;
          // const test = contract.call({
          //   func,
          //   args,
          //   gasLimit: 9000000,
          //   chainID: 'D',
          //   caller: ''
          // });

          return {
            success: true,
            data: undefined
          };
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

  return callContract;
};
