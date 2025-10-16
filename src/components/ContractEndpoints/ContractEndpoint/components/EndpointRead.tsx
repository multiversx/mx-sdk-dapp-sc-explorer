import React, { useState } from 'react';

import { EndpointForm } from 'components';
import { useSCExplorerContext } from 'contexts';
import { useQueryContract } from 'hooks';
import { NativeSerializer } from 'lib/sdkCore';
import {
  ContractEndpointMutabilityEnum,
  QueryContractResponse,
  BaseEndpointUIType
} from 'types';

export const EndpointRead = (props: BaseEndpointUIType) => {
  const queryContract = useQueryContract();
  const { support } = useSCExplorerContext();
  const { canRead } = support;
  const { endpoint } = props;
  const { modifiers } = endpoint;
  const { mutability } = modifiers;

  const [result, setResult] = useState<QueryContractResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (nativeValues: any[]) => {
    setError(undefined);
    setIsLoading(true);
    try {
      const args = NativeSerializer.nativeToTypedValues(
        nativeValues || [],
        endpoint
      );
      const queryResult = await queryContract({ func: endpoint.name, args });
      if (queryResult.success && queryResult?.data) {
        setResult(queryResult.data);
      } else {
        if (queryResult?.error) {
          setError(queryResult.error);
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
      resetForm={false}
      buttonText='Query'
      {...props}
    />
  );
};
