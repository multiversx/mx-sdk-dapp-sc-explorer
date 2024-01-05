import { UserInterfaceType } from 'types';
import { VerifiedContractTabsEnum } from 'types';

export interface LayoutComponentUIType extends UserInterfaceType {
  activeSection: VerifiedContractTabsEnum;
}

export interface LayoutSidebarNavLinksUIType {
  title: React.ReactNode;
  isActive: boolean;
  badge?: React.ReactNode;
}

export interface LayoutSidebarNavLinksType {
  [key: string]: LayoutSidebarNavLinksUIType;
}
