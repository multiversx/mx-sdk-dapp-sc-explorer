import { InterfaceIconsType } from './icons.types';

export interface CustomUIType {
  icons?: InterfaceIconsType;
  customClassNames?: CustomClassNamesType;
}

export interface UserInterfaceType {
  customInterface?: CustomUIType;
  className?: string;
  'data-testid'?: string;
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
  btnClassName?: string;
  btnPrimaryClassName?: string;
  btnSecondaryClassName?: string;
  inputClassName?: string;
  inputInvalidClassName?: string;
  inputInvalidFeedbackClassName?: string;
  inputGroupClassName?: string;
  inputGroupAppendClassName?: string;
  inputGroupPrependClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}
