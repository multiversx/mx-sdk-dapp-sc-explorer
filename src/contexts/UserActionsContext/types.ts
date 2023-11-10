import { EndpointDefinition, TypedValue } from '@multiversx/sdk-core/out';

import { PartialEsdtType, PartialNftType } from 'types';

export interface UserActionStateType {
  loginModalState: LoginModalStateType | undefined;
  mutateModalState: MutateModalStateType | undefined;
  accountTokens: PartialEsdtType[] | undefined;
  accountNfts: PartialNftType[] | undefined;
}

export enum UserActionDispatchTypeEnum {
  setLoginModalState = 'setLoginModalState',
  setMutateModalState = 'setMutateModalState',
  setAccountTokensState = 'setAccountTokensState'
}

export type UserActionDispatchType = (
  action: UserActionDispatchActionType
) => void;

export interface MutateModalStateType {
  mutateModalOpen?: boolean;
  args?: TypedValue[];
  endpoint?: EndpointDefinition;
}

export interface LoginModalStateType {
  loginModalOpen?: boolean;
}

export interface UserActionDispatchActionType {
  type: UserActionDispatchTypeEnum;
  loginModalState?: LoginModalStateType;
  mutateModalState?: MutateModalStateType;
  accountTokens?: PartialEsdtType[];
}
