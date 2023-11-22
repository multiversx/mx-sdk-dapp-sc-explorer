import { Dispatch, SetStateAction } from 'react';
import { UserInterfaceType } from 'types';

export interface PanelHeaderUIType extends UserInterfaceType {
  showButtons?: boolean;
  onAllExpanded?: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}
