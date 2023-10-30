import {
  Address,
  SmartContract,
  IContractFunction,
  TypedValue,
  AbiRegistry
} from '@multiversx/sdk-core/out';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { SC_GAS_LIMIT } from 'constants/general';
import { calculateGasLimit } from 'helpers';

interface GetCallContractTransactionType {
  contractAddress?: string;
  callerAddress?: string;
  abiRegistry?: AbiRegistry;
  func?: IContractFunction;
  args?: TypedValue[];
  isGuarded?: boolean;
  userGasLimit?: string | number;
}

export const getCallContractTransaction = ({
  contractAddress,
  callerAddress,
  abiRegistry,
  func,
  args,
  isGuarded,
  userGasLimit
}: GetCallContractTransactionType) => {
  if (contractAddress && callerAddress && abiRegistry && func && args) {
    try {
      const owner = new Address(contractAddress);
      const caller = new Address(callerAddress);
      const contract = new SmartContract({
        address: owner,
        abi: abiRegistry
      });

      if (contract) {
        const transaction = contract.call({
          func,
          args,
          gasLimit: SC_GAS_LIMIT,
          chainID: getChainID(),
          caller
        });
        if (userGasLimit) {
          transaction.setGasLimit(Number(userGasLimit));
        } else {
          const gasLimit = calculateGasLimit({
            data: transaction.getData().toString(),
            isGuarded
          });
          transaction.setGasLimit(Number(gasLimit));
        }

        return transaction;
      }
    } catch (error) {
      console.error('Unable to prepare SC Call Transaction: ', error);
    }
  }

  return undefined;
};
