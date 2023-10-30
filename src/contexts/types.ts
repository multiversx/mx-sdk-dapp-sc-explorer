import { EndpointDefinition, TypedValue } from '@multiversx/sdk-core/out';

export interface UserActionsType {
  loginModalOpen: boolean | undefined;
  mutateModalState: MutateModalType | undefined;
}

export enum ActionTypeEnum {
  setLoginModalOpen = 'setLoginModalOpen',
  setMutateModalState = 'setMutateModaState'
}

export type DispatchType = (action: ActionType) => void;

export interface MutateModalType {
  mutateModalOpen?: boolean;
  args?: TypedValue[];
  endpoint?: EndpointDefinition;
}

export interface ActionType {
  type: ActionTypeEnum;
  loginModalOpen?: boolean;
  mutateModalState?: MutateModalType;
}
