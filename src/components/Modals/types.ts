import { UserInterfaceType } from 'types';

export interface ModalUIType extends UserInterfaceType {
  onClose: () => void;
  show: boolean | undefined;
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  footer?: string | React.ReactNode;
}

export interface LoginModalUIType extends UserInterfaceType {}
