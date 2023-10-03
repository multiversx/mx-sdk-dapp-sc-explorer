import { BadgeUIType } from 'types';

export interface CollapsibleCardUIType extends BadgeUIType {
  title: string;
  titleContent?: React.ReactNode;
  children?: React.ReactNode;
  isOpen?: boolean;
}

export interface CollapsibleArrowsUIType extends BadgeUIType {
  expanded: boolean;
  size?: 'sm' | 'xs';
}
