export interface UserActionsType {
  loginModalOpen: boolean | undefined;
}

export enum ActionTypeEnum {
  setLoginModalOpen = 'setLoginModalOpen'
}

export type DispatchType = (action: ActionType) => void;
export interface ActionType {
  type: ActionTypeEnum;
  loginModalOpen?: boolean;
}
