import {
  Address,
  SmartContract,
  IContractFunction,
  TypedValue,
  AbiRegistry,
  Interaction,
  ContractFunction
} from '@multiversx/sdk-core/out';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { SC_GAS_LIMIT } from 'constants/general';

interface GetCallContractTransactionType {
  contractAddress?: string;
  callerAddress?: string;
  abiRegistry?: AbiRegistry;
  func?: IContractFunction;
  args?: TypedValue[];
  userGasLimit?: string | number;
}

export const getCallContractTransaction = ({
  contractAddress,
  callerAddress,
  abiRegistry,
  func,
  args,
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
        const interaction = new Interaction(
          contract,
          new ContractFunction(func.toString()),
          args
        )
          .withChainID(getChainID())
          .withGasLimit(Number(userGasLimit ?? SC_GAS_LIMIT))
          .withSender(caller);

        console.log(
          '---interaction',
          interaction.buildTransaction().toPlainObject()
        );

        const transaction = contract.call({
          func,
          args,
          gasLimit: SC_GAS_LIMIT,
          chainID: getChainID(),
          caller
        });

        console.log('----transaction', transaction.toPlainObject());

        return transaction;
      }
    } catch (error) {
      console.error('Unable to prepare SC Call Transaction: ', error);
    }
  }

  return undefined;
};
