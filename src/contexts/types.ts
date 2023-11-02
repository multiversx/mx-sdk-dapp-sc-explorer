import { EndpointDefinition, TypedValue } from '@multiversx/sdk-core/out';

import { PartialEsdtType, PartialNftType } from 'types';

export interface UserActionsStateType {
  loginModalState: LoginModalStateType | undefined;
  mutateModalState: MutateModalStateType | undefined;
  accountTokens: PartialEsdtType[] | undefined;
  accountNfts: PartialNftType[] | undefined;
}

export enum ActionTypeEnum {
  setLoginModalState = 'setLoginModalState',
  setMutateModalState = 'setMutateModalState',
  setAccountTokensState = 'setAccountTokensState'
}

export type DispatchType = (action: ActionType) => void;

export interface MutateModalStateType {
  mutateModalOpen?: boolean;
  args?: TypedValue[];
  endpoint?: EndpointDefinition;
}

export interface LoginModalStateType {
  loginModalOpen?: boolean;
}

export interface ActionType {
  type: ActionTypeEnum;
  loginModalState?: LoginModalStateType;
  mutateModalState?: MutateModalStateType;
  accountTokens?: PartialEsdtType[];
}
