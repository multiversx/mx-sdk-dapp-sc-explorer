import { UserInterfaceType } from 'types';

export interface SelectOptionType {
  label: string;
  value: string;
  token: any;
  assets?: any;
}

export interface AmountSelectInputUIType extends UserInterfaceType {
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
