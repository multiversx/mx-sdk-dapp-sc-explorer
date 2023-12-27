import { UserInterfaceType } from 'types';
import { VerifiedContractTabsEnum } from 'types';

export interface LayoutComponentUIType extends UserInterfaceType {
  activeSection: VerifiedContractTabsEnum;
}

export interface LayoutSidebarNavLinksUIType {
  title: string | React.ReactNode;
  isActive: boolean;
  badge?: string | React.ReactNode;
}

export interface LayoutSidebarNavLinksType {
  [key: string]: LayoutSidebarNavLinksUIType;
}
