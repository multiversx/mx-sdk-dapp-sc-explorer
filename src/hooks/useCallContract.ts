import {
  Address,
  SmartContract,
  IContractFunction,
  TypedValue
} from '@multiversx/sdk-core/out';
import { useGetAccount, useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
//import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';
import { signTransactions } from '@multiversx/sdk-dapp/services/transactions/signTransactions';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { useScContext } from 'context';

export interface CallContractProps {
  func: IContractFunction;
  args?: TypedValue[];
}

export const useCallContract = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address: userAddress } = useGetAccount();
  const { abiRegistry, ownerAddress } = useScContext();

  const callContract = async (props: CallContractProps) => {
    if (isLoggedIn && userAddress && abiRegistry && ownerAddress) {
      try {
        const owner = new Address(ownerAddress);
        const caller = new Address(userAddress);
        const contract = new SmartContract({
          address: owner,
          abi: abiRegistry
        });

        if (contract) {
          const { func, args } = props;
          const transaction = contract.call({
            func,
            args,
            gasLimit: 2000000,
            chainID: getChainID(),
            caller
          });
          console.log('transaction Object', transaction.toPlainObject());

          await refreshAccount();
          const { error, sessionId } = await signTransactions({
            transactions: transaction,
            transactionsDisplayInfo: {
              processingMessage: 'Processing Transaction',
              errorMessage: 'An error has occured during Contract Write',
              successMessage: 'Contract Write Transaction successful'
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

    if (!(isLoggedIn && userAddress)) {
      return {
        success: false,
        error: 'Not Logged In'
      };
    }

    return {
      success: false
    };
  };

  return callContract;
};
