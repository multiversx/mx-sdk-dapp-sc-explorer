import { SC_DEPLOY_GAS_LIMIT } from 'constants/general';
import { getChainId } from 'helpers';
import {
  Address,
  TransactionsFactoryConfig,
  SmartContractTransactionsFactory,
  ContractUpgradeInput
} from 'lib/sdkCore';
import { GetUpgradeTransactionType } from 'types';

export const getUpgradeTransaction = ({
  callerAddress,
  contractAddress,
  abiRegistry,
  args,
  userGasLimit,
  code,
  metadata,
  nonce
}: GetUpgradeTransactionType) => {
  if (callerAddress && contractAddress) {
    try {
      const contract = new Address(contractAddress);
      const caller = new Address(callerAddress);
      const config = new TransactionsFactoryConfig({
        chainID: getChainId()
      });
      const factory = new SmartContractTransactionsFactory({
        config: config,
        abi: abiRegistry
      });

      if (factory) {
        const options = {
          contract,
          bytecode: Buffer.from(code.toString(), 'hex'),
          gasLimit: BigInt(userGasLimit ?? SC_DEPLOY_GAS_LIMIT),
          arguments: args,
          nativeTransferAmount: BigInt(0),
          isUpgradeable: metadata.upgradeable,
          isReadable: metadata.readable,
          isPayable: metadata.payable,
          isPayableBySmartContract: metadata.payableBySc
        } as ContractUpgradeInput;
        const transaction = factory.createTransactionForUpgrade(
          caller,
          options
        );

        if (nonce) {
          transaction.nonce = nonce;
        }

        if (transaction) {
          return transaction;
        }
      }
    } catch (error) {
      console.error('Unable to prepare SC Call Transaction: ', error);
    }
  }

  return undefined;
};
