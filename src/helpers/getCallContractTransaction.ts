import {
  Address,
  SmartContract,
  Interaction,
  ContractFunction,
  TokenTransfer
} from '@multiversx/sdk-core/out';
import {
  EsdtEnumType,
  NftEnumType
} from '@multiversx/sdk-dapp/types/tokens.types';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';

import { SC_GAS_LIMIT } from 'constants/general';
import { GetCallContractTransactionType, ProcessedFormTokenType } from 'types';

const getTokenTransferInteraction = ({
  tokens,
  interaction
}: {
  tokens: ProcessedFormTokenType[];
  interaction: Interaction;
}) => {
  try {
    const validTokens = tokens.filter((token) =>
      Boolean(
        token.tokenType === 'native' ||
          token.tokenType === EsdtEnumType.FungibleESDT ||
          token.tokenType === NftEnumType.MetaESDT
      )
    );

    if (
      validTokens.length === 1 &&
      validTokens.every((token) => token.tokenType === 'native')
    ) {
      return interaction.withValue(
        TokenTransfer.egldFromAmount(validTokens[0].tokenAmount)
      );
    }

    if (
      validTokens.every(
        (token) =>
          token.tokenType === EsdtEnumType.FungibleESDT ||
          token.tokenType === NftEnumType.MetaESDT
      )
    ) {
      const transfers = validTokens.map((token) => {
        if (token.tokenType === NftEnumType.MetaESDT && token.tokenNonce) {
          return TokenTransfer.metaEsdtFromAmount(
            token.tokenIdentifier,
            token.tokenNonce,
            token.tokenAmount,
            token.tokenDecimals
          );
        }
        return TokenTransfer.fungibleFromAmount(
          token.tokenIdentifier,
          token.tokenAmount,
          token.tokenDecimals
        );
      });

      if (transfers.length === 1) {
        return interaction.withSingleESDTNFTTransfer(transfers[0]);
      }

      return interaction.withMultiESDTNFTTransfer(transfers);
    }
  } catch (error) {
    console.error('Unable to prepare SC Token Trasnfer: ', error);
  }

  return;
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

        if (tokens && tokens.length > 0) {
          // Accept only native EGLD, Fungible Tokens and metaESDTs for now
          const tokenTransferInteraction = getTokenTransferInteraction({
            tokens,
            interaction
          });
          if (tokenTransferInteraction) {
            return tokenTransferInteraction.buildTransaction();
          }
        }

        return interaction.buildTransaction();
      }
    } catch (error) {
      console.error('Unable to prepare SC Call Transaction: ', error);
    }
  }

  return undefined;
};
