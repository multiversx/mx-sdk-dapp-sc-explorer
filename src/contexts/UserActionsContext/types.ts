import {
  EndpointDefinition,
  TypedValue,
  ICode
} from '@multiversx/sdk-core/out';

import { PartialEsdtType, PartialNftType } from 'types';

export interface UserActionStateType {
  loginModalState: LoginModalStateType | undefined;
  mutateModalState: MutateModalStateType | undefined;
  deployModalState: DeployModalStateType | undefined;
  upgradeModalState: UpgradeModalStateType | undefined;
  accountTokens: PartialEsdtType[] | undefined;
  accountNfts: PartialNftType[] | undefined;
}

export enum UserActionDispatchTypeEnum {
  setLoginModalState = 'setLoginModalState',
  setMutateModalState = 'setMutateModalState',
  setDeployModalState = 'setDeployModalState',
  setUpgradeModalState = 'setUpgradeModalState',
  setAccountTokensState = 'setAccountTokensState'
}

export type UserActionDispatchType = (
  action: UserActionDispatchActionType
) => void;

export interface TransactionModalStateBaseType {
  endpoint: EndpointDefinition | undefined;
  code: ICode | undefined;
  args: TypedValue[];
}

export interface MutateModalStateType extends TransactionModalStateBaseType {
  mutateModalOpen: boolean;
}

export interface DeployModalStateType extends TransactionModalStateBaseType {
  deployModalOpen: boolean;
}

export interface UpgradeModalStateType extends TransactionModalStateBaseType {
  upgradeModalOpen: boolean;
}

export interface LoginModalStateType {
  loginModalOpen: boolean;
}

export interface UserActionDispatchActionType {
  type: UserActionDispatchTypeEnum;
  loginModalState?: LoginModalStateType;
  mutateModalState?: MutateModalStateType;
  deployModalState?: DeployModalStateType;
  upgradeModalState?: UpgradeModalStateType;
  accountTokens?: PartialEsdtType[];
}
