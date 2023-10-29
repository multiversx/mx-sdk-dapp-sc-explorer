import React, { useState } from 'react';
import { NativeSerializer } from '@multiversx/sdk-core/out';

import { useSCExplorerContext } from 'contexts';
import { useCallContract } from 'hooks';
import { ContractEndpointMutabilityEnum, BaseEndpointUIType } from 'types';
import { EndpointForm } from './EndpointForm';

export const EndpointMutate = (props: BaseEndpointUIType) => {
  const callContract = useCallContract();
  const { support } = useSCExplorerContext();
  const { canMutate } = support;
  const { endpoint } = props;
  const { modifiers } = endpoint;
  const { mutability } = modifiers;

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

      const result = await callContract({ func: endpoint.name, args });
      setIsLoading(false);
      if (result?.error) {
        setError(String(result.error));
      }
    } catch (error) {
      setIsLoading(false);
      setError(String(error));
    }
  };

  if (!(canMutate && mutability === ContractEndpointMutabilityEnum.mutable)) {
    return null;
  }

  return (
    <EndpointForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      generalError={error}
      buttonText='Send Transaction'
      {...props}
    />
  );
};
