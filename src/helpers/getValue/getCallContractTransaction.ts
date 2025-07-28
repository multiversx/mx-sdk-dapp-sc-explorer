import { SC_GAS_LIMIT } from 'constants/general';
import { getChainId } from 'helpers';
import { EsdtEnumType, NftEnumType, parseAmount } from 'lib';
import {
  Address,
  TokenTransfer,
  Token,
  TransactionsFactoryConfig,
  SmartContractTransactionsFactory
} from 'lib/sdkCore';
import { GetCallContractTransactionType, ProcessedFormTokenType } from 'types';

const getTokenTransfers = ({
  tokens
}: {
  tokens?: ProcessedFormTokenType[];
}) => {
  if (!tokens) {
    return [];
  }

  try {
    const validTokens = tokens.filter((token) =>
      Boolean(
        (token.tokenType === 'native' ||
          token.tokenType === EsdtEnumType.FungibleESDT ||
          token.tokenType === NftEnumType.MetaESDT) &&
          token.tokenAmount !== ''
      )
    );

    const tokenTransfers = validTokens.map((token: ProcessedFormTokenType) => {
      const amount = parseAmount(token.tokenAmount, token.tokenDecimals);
      if (token.tokenType === 'native') {
        return TokenTransfer.newFromNativeAmount(BigInt(amount));
      }

      return new TokenTransfer({
        token: new Token({
          identifier: token.tokenIdentifier,
          nonce: BigInt(token.tokenNonce)
        }),
        amount: BigInt(amount)
      });
    });

    return tokenTransfers;
  } catch (error) {
    console.error('Unable to prepare SC Token Trasnfer: ', error);
  }

  return [];
};

export const getCallContractTransaction = ({
  contractAddress,
  callerAddress,
  abiRegistry,
  func,
  args,
  userGasLimit,
  tokens
}: GetCallContractTransactionType) => {
  if (contractAddress && callerAddress && abiRegistry && func && args) {
    try {
      const owner = new Address(contractAddress);
      const caller = new Address(callerAddress);

      const config = new TransactionsFactoryConfig({
        chainID: getChainId()
      });
      const factory = new SmartContractTransactionsFactory({
        config: config,
        abi: abiRegistry
      });

      if (factory) {
        // Accept only native EGLD, Fungible Tokens and metaESDTs for now
        const tokenTransfers = getTokenTransfers({ tokens });
        const transaction = factory.createTransactionForExecute(caller, {
          contract: owner,
          gasLimit: BigInt(userGasLimit ?? SC_GAS_LIMIT),
          function: func?.toString() ?? '',
          arguments: args,
          tokenTransfers
        });
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
