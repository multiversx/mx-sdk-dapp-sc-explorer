import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { UserInterfaceType } from 'types';

export interface CardItemUIType extends UserInterfaceType {
  title: string;
  children?: React.ReactNode;
  icon?: IconProp;
  customIcon?: React.ReactNode;
}
