import {
  Address,
  SmartContract,
  TokenTransfer,
  CodeMetadata
} from '@multiversx/sdk-core/out';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { SC_GAS_LIMIT } from 'constants/general';
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
  if (callerAddress && contractAddress && abiRegistry && args) {
    try {
      const caller = new Address(callerAddress);
      const address = new Address(contractAddress);
      const contract = new SmartContract({
        abi: abiRegistry,
        address
      });

      if (contract) {
        const codeMetadata = new CodeMetadata(
          metadata.upgradeable,
          metadata.readable,
          metadata.payable,
          metadata.payableBySc
        );
        const transaction = contract.upgrade({
          caller,
          code,
          codeMetadata,
          gasLimit: Number(userGasLimit ?? SC_GAS_LIMIT),
          initArguments: args,
          value: TokenTransfer.egldFromAmount(0),
          chainID: getChainID()
        });
        if (nonce) {
          transaction.setNonce(nonce);
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
