import {
  Address,
  SmartContract,
  TokenTransfer,
  CodeMetadata
} from '@multiversx/sdk-core/out';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { SC_DEPLOY_GAS_LIMIT } from 'constants/general';
import { GetDeployTransactionType } from 'types';

export const getDeployTransaction = ({
  callerAddress,
  abiRegistry,
  args,
  userGasLimit,
  code,
  metadata,
  nonce
}: GetDeployTransactionType) => {
  if (callerAddress && abiRegistry && args) {
    try {
      const caller = new Address(callerAddress);
      const contract = new SmartContract({
        abi: abiRegistry
      });

      if (contract) {
        const codeMetadata = new CodeMetadata(
          metadata.upgradeable,
          metadata.readable,
          metadata.payable,
          metadata.payableBySc
        );
        const transaction = contract.deploy({
          deployer: caller,
          code,
          codeMetadata,
          gasLimit: Number(userGasLimit ?? SC_DEPLOY_GAS_LIMIT),
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
