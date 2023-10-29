import {
  Address,
  SmartContract,
  IContractFunction,
  TypedValue
} from '@multiversx/sdk-core/out';
import { GAS_LIMIT } from '@multiversx/sdk-dapp/constants/index';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { useSCExplorerContext } from 'contexts';
import { calculateGasLimit } from 'helpers';

export interface CallContractProps {
  func: IContractFunction;
  args?: TypedValue[];
}

export const useCallContract = () => {
  const { accountInfo, smartContract } = useSCExplorerContext();
  const { isLoggedIn, address: callerAddress, isGuarded } = accountInfo;
  const { abiRegistry, contractAddress } = smartContract;

  const callContract = async (props: CallContractProps) => {
    if (isLoggedIn && callerAddress && abiRegistry && contractAddress) {
      try {
        const owner = new Address(contractAddress);
        const caller = new Address(callerAddress);
        const contract = new SmartContract({
          address: owner,
          abi: abiRegistry
        });

        if (contract) {
          const { func, args } = props;
          const transaction = contract.call({
            func,
            args,
            gasLimit: GAS_LIMIT,
            chainID: getChainID(),
            caller
          });
          const gasLimit = calculateGasLimit({
            data: transaction.getData().toString(),
            isGuarded
          });
          transaction.setGasLimit(Number(gasLimit));

          console.log('transaction Object', transaction.toPlainObject());

          const { error, sessionId } = await sendTransactions({
            signWithoutSending: true,
            transactions: [transaction],
            transactionsDisplayInfo: {
              processingMessage: 'Processing Transaction',
              errorMessage: 'An error has occured during Contract Mutation',
              successMessage: 'Contract Mutation Transaction successful'
            }
          });

          return {
            success: true,
            data: sessionId,
            error
          };
        }
      } catch (error) {
        console.error('Unable to prepare SC Call: ', error);
        return {
          success: false,
          error: 'Unable to prepare SC Call'
        };
      }
    }

    if (!(isLoggedIn && callerAddress)) {
      return {
        success: false,
        error: 'Not Logged In'
      };
    }

    if (!contractAddress) {
      return {
        success: false,
        error: 'Missing SC Address'
      };
    }

    return {
      success: false,
      error: 'Invalid Config'
    };
  };

  return callContract;
};
