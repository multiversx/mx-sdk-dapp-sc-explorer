import React, { useState } from 'react';
import { NativeSerializer } from '@multiversx/sdk-core/out';

import { useScContext } from 'context';
import { useQueryContract } from 'hooks';
import {
  ContractEndpointMutabilityEnum,
  QueryContractResponse,
  BaseEndpointUIType,
  EndpointInputValuesType
} from 'types';

import { EndpointForm } from './EndpointForm';

export const EndpointRead = (props: BaseEndpointUIType) => {
  const queryContract = useQueryContract();
  const { canRead } = useScContext();
  const { endpoint } = props;
  const { modifiers } = endpoint;
  const { mutability } = modifiers;

  const [result, setResult] = useState<QueryContractResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (values: EndpointInputValuesType) => {
    setError(undefined);
    setIsLoading(true);
    try {
      const valuesArray = Object.values(values);
      const args = NativeSerializer.nativeToTypedValues(
        valuesArray || [],
        endpoint
      );
      const result = await queryContract({ func: endpoint.name, args });
      if (result.success && result?.data) {
        setResult(result.data);
      } else {
        if (result?.error) {
          setError(result.error);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(String(error));
    }
  };

  if (!(canRead && mutability === ContractEndpointMutabilityEnum.readonly)) {
    return null;
  }

  return (
    <EndpointForm
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      generalError={error}
      buttonText='Query'
      {...props}
    />
  );
};
