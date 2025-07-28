import {
  EndpointDefinition,
  ICode,
  Transaction,
  TypedValue
} from 'lib/sdkCore';
import {
  SC_GAS_LIMIT,
  SC_DEPLOY_GAS_LIMIT,
  SC_SIMULATE_GAS_LIMIT,
  METADATA_OPTIONS
} from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import {
  getCallContractTransaction,
  getDeployTransaction,
  getUpgradeTransaction
} from 'helpers';
import { useGetTransactionCost } from 'hooks';
import { MetadataFieldsInitialValuesType, ProcessedFormTokenType } from 'types';

export interface TransactionCostDetailsType {
  isUpgrade?: boolean;
  isDeploy?: boolean;
  isMutate?: boolean;
  args?: TypedValue[];
  endpoint?: EndpointDefinition;
  code?: ICode;
}

export const useGetTransactionCostDetails = ({
  endpoint,
  code,
  args,
  isUpgrade = false,
  isDeploy = false,
  isMutate = false
}: TransactionCostDetailsType) => {
  const { accountInfo, smartContract } = useSCExplorerContext();
  const { abiRegistry, contractAddress } = smartContract ?? {};
  const { address: callerAddress, nonce: accountNonce } = accountInfo;

  const getTransactionCost = useGetTransactionCost({ isDeploy });

  const metadataOptionsInitialValues =
    isDeploy || isUpgrade
      ? Object.fromEntries(
          Object.entries(METADATA_OPTIONS).map(([key, { checked }]) => [
            key,
            checked
          ])
        )
      : {};

  const defaultGasLimit = isMutate ? SC_GAS_LIMIT : SC_DEPLOY_GAS_LIMIT;
  const nonce = BigInt(accountNonce);

  const getTransactionCostDetails = async ({
    tokens
  }: {
    tokens?: ProcessedFormTokenType[];
  }) => {
    let transaction: Transaction | undefined = undefined;
    if (isMutate) {
      transaction = getCallContractTransaction({
        contractAddress,
        callerAddress,
        abiRegistry,
        func: endpoint?.name,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        tokens,
        nonce
      });
    }
    if (isDeploy && code) {
      transaction = getDeployTransaction({
        callerAddress,
        abiRegistry,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        code,
        metadata:
          metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType,
        nonce
      });
    }
    if (isUpgrade && code && contractAddress) {
      transaction = getUpgradeTransaction({
        contractAddress,
        callerAddress,
        abiRegistry,
        args,
        userGasLimit: SC_SIMULATE_GAS_LIMIT,
        code,
        metadata:
          metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType,
        nonce
      });
    }

    if (transaction) {
      const transactionGasLimit = await getTransactionCost(transaction);
      return transactionGasLimit;
    }

    return {
      gasLimit: defaultGasLimit,
      isVerified: false
    };
  };

  return getTransactionCostDetails;
};
