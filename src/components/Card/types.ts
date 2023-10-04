import { BadgeUIType } from 'types';

export interface CardUIType extends BadgeUIType {
  title?: string;
  titleContent?: React.ReactNode;
  children?: React.ReactNode;
  isOpen?: boolean;
}
