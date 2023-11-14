import { UserInterfaceType } from 'types';

export interface TransactionStatusUIType extends UserInterfaceType {
  onClose: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  successText?: string | React.ReactNode;
  buttonText?: string | React.ReactNode;
  sessionId?: string;
}
