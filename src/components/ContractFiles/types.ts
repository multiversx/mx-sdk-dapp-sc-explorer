import { UserInterfaceType, ContractFileType } from 'types';

export interface ContractFilesUIType extends UserInterfaceType {
  highlightFileHash?: string;
}

export interface ContractFileUIType extends UserInterfaceType {
  file: ContractFileType;
  entryNumber?: number;
  totalEntries?: number;
  isOpen?: boolean;
  title?: string;
}
