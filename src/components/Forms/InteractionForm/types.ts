import { EndpointDefinition, TypedValue, ICode } from 'lib/sdkCore';
import { FormikProps } from 'formik';
import {
  UserInterfaceType,
  MetadataFieldsEnum,
  ProcessedFormTokenType,
  PartialEsdtType
} from 'types';

export enum InteractionModalFormikFieldsEnum {
  gasLimit = 'gasLimit',
  tokens = 'tokens'
}
export interface MetadataFieldsInitialValuesType {
  [MetadataFieldsEnum.readable]: boolean;
  [MetadataFieldsEnum.upgradeable]: boolean;
  [MetadataFieldsEnum.payable]: boolean;
  [MetadataFieldsEnum.payableBySc]: boolean;
}
export interface DeployUpgradeModalInitialValuesType {
  [InteractionModalFormikFieldsEnum.gasLimit]: number;
  [MetadataFieldsEnum.readable]: boolean;
  [MetadataFieldsEnum.upgradeable]: boolean;
  [MetadataFieldsEnum.payable]: boolean;
  [MetadataFieldsEnum.payableBySc]: boolean;
}

export interface MutateModalInitialValuesType {
  [InteractionModalFormikFieldsEnum.gasLimit]: number;
  [InteractionModalFormikFieldsEnum.tokens]: ProcessedFormTokenType[];
}

export interface InteractionModalInitialValuesType {
  [InteractionModalFormikFieldsEnum.gasLimit]: number;
  [InteractionModalFormikFieldsEnum.tokens]: ProcessedFormTokenType[];
  [MetadataFieldsEnum.readable]: boolean;
  [MetadataFieldsEnum.upgradeable]: boolean;
  [MetadataFieldsEnum.payable]: boolean;
  [MetadataFieldsEnum.payableBySc]: boolean;
}

export interface InteractionModalFormUIType extends UserInterfaceType {
  onSubmit: (values: InteractionModalInitialValuesType) => Promise<void>;
  isLoading: boolean;
  isUpgrade?: boolean;
  isDeploy?: boolean;
  isMutate?: boolean;
  generalError?: string;
  buttonText?: React.ReactNode;
  panelDescription?: React.ReactNode;
}

export interface InteractionFormUIType extends InteractionModalFormUIType {
  tokens?: PartialEsdtType[];
  endpoint?: EndpointDefinition;
  code?: ICode;
  args?: TypedValue[];
}

export interface InteractionFormContentUIType extends InteractionFormUIType {
  formik: FormikProps<InteractionModalInitialValuesType>;
}
