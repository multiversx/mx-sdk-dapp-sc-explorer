import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { UserInterfaceType } from 'types';

export interface BadgeUIType extends UserInterfaceType {
  badgeValue?: string | React.ReactNode;
  badgeClassName?: string;
  badgeIcon?: IconProp;
}
