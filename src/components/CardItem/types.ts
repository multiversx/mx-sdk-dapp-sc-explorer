import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserInterfaceType } from 'types';

export interface CardItemUIType extends UserInterfaceType {
  title: string;
  children?: React.ReactNode;
  icon?: IconDefinition;
  customIcon?: React.ReactNode;
}
