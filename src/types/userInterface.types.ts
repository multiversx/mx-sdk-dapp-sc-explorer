import { InterfaceIconsType } from './icons.types';

export interface UserInterfaceType {
  className?: string;
  'data-testid'?: string;
}

export interface CustomUIType extends UserInterfaceType {
  icons?: InterfaceIconsType;
  customClassNames?: CustomClassNamesType;
}

export interface CustomClassNamesType {
  wrapperClassName?: string;
  cardClassName?: string;
  cardHeaderClassName?: string;
  cardBodyClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  badgeClassName?: string;
  badgePrimaryClassName?: string;
  badgeSecondaryClassName?: string;
  badgeIconClassName?: string;
  cardItemClassName?: string;
  cardItemIconClassName?: string;
  cardItemTitleClassName?: string;
  cardItemValueClassName?: string;
  cardItemContainerClassName?: string;
  buttonClassName?: string;
  buttonPrimaryClassName?: string;
  buttonSecondaryClassName?: string;
  inputClassName?: string;
  inputInvalidClassName?: string;
  inputInvalidFeedbackClassName?: string;
  inputGroupClassName?: string;
  inputGroupAppendClassName?: string;
  inputGroupPrependClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}
