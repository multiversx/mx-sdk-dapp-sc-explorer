import React, { useState } from 'react';
import { NativeSerializer } from '@multiversx/sdk-core/out';

import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { useGetAccountTokens } from 'hooks';
import {
  ContractEndpointMutabilityEnum,
  BaseEndpointUIType,
  UserActionDispatchTypeEnum
} from 'types';
import { EndpointForm } from './EndpointForm';

export const EndpointMutate = (props: BaseEndpointUIType) => {
  const userActionDispatch = useUserActionDispatch();
  const getAccountTokens = useGetAccountTokens();
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
      await getAccountTokens(modifiers.payableInTokens ?? []);
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setMutateModalState,
        mutateModalState: {
          mutateModalOpen: true,
          args,
          endpoint
        }
      });
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
      return;
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
