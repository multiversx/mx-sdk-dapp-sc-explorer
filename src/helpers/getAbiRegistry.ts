import { AbiRegistry } from '@multiversx/sdk-core/out';
import {
  INTERFACE_NAME_PLACEHOLDER,
  OperationCompletionStatus
} from 'constants/general';
import { isValueInObject } from 'helpers';

export const getAbiRegistry = (abi: any) => {
  if (!abi || Object.keys(abi).length == 0) {
    return;
  }

  if (!abi.name) {
    abi.name = INTERFACE_NAME_PLACEHOLDER;
  }

  // add the OperationCompletionStatus explicit-enum in case it is missing from the abi types but required in endpoints
  if (
    abi?.types &&
    !abi.types?.OperationCompletionStatus &&
    isValueInObject(abi, 'type', 'OperationCompletionStatus')
  ) {
    abi.types = { ...abi.types, OperationCompletionStatus };
  }

  return AbiRegistry.create(abi);
};
