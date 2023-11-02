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
