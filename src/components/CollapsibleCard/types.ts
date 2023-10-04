import { BadgeUIType, CardUIType } from 'types';

export interface CollapsibleCardUIType extends CardUIType {}

export interface CollapsibleArrowsUIType extends BadgeUIType {
  expanded: boolean;
  size?: 'sm' | 'xs';
}
