import { SignedTransactionType } from '@multiversx/sdk-dapp/types/transactions.types';
import { UserInterfaceType } from 'types';

export interface TransactionPanelUIType extends UserInterfaceType {
  onClose: () => void;
  status?: string;
  transactions?: SignedTransactionType[];
  panelDescription?: string | React.ReactNode;
  panelErrorDescription?: string | React.ReactNode;
}

export enum TransactionEventIdentifierEnum {
  SCDeploy = 'SCDeploy'
}
