import {
  EsdtEnumType,
  NftEnumType
} from '@multiversx/sdk-dapp/types/tokens.types';

import { UserInterfaceType } from 'types';

export interface ModalUIType extends UserInterfaceType {
  onClose: () => void;
  show: boolean | undefined;
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  footer?: string | React.ReactNode;
}

export interface LoginModalUIType extends UserInterfaceType {}

export interface MutateModalUIType extends UserInterfaceType {}

export interface SelectOptionType {
  label: string;
  value: string;
  token: any;
  assets?: any;
}

export interface AmountSelectInputUIType {
  inputName: string;
  selectName: string;
  title: string;
  hasErrors?: boolean;
  errorMessage?: string;
  tokenAmount: string;
  isInputLoading?: boolean;
  isSelectLoading?: boolean;
  isInputDisabled?: boolean;
  balanceText?: string;
  tokenUsdPrice: string;
  showMaxButton?: boolean;
  token: SelectOptionType | undefined;
  inputPlaceholder?: string | undefined;
  disabledOption?: SelectOptionType;
  optionsSelect: SelectOptionType[];
  handleBlurSelect: (option: SelectOptionType) => void;
  onChangeSelect: (option: SelectOptionType) => void;
  onBlurInput: (e: React.FocusEvent) => void;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxBtnClick?: (value: string) => void;
  handleDisabledOptionClick?: () => void;
  onFocusSelect?: () => void;
}

export interface AssetsType {
  website?: string;
  description?: string;
  status?: string;
  pngUrl?: string;
  svgUrl?: string;
  social?: any;
}
export interface EsdtType {
  balance: string | null;
  decimals: string | number;
  name: string;
  identifier: string;
  ticker: string;
  owner: string;
  type: EsdtEnumType | NftEnumType | 'native' | '';
  assets?: AssetsType;
  price?: string | number;
}
