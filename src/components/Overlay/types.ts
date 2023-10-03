import { UserInterfaceType } from 'types';

export interface OverlayUIType extends UserInterfaceType {
  children: React.ReactNode;
  title: React.ReactNode | string;
  className?: string;
  wraperClassName?: string;
  tooltipClassName?: string;
}
