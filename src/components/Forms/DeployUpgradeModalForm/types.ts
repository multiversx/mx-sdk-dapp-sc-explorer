import { UserInterfaceType, MetadataFieldsEnum } from 'types';

export enum DeployModalFormikFieldsEnum {
  gasLimit = 'gasLimit'
}
export interface MetadataFieldsInitialValuesType {
  [MetadataFieldsEnum.readable]: boolean;
  [MetadataFieldsEnum.upgradeable]: boolean;
  [MetadataFieldsEnum.payable]: boolean;
  [MetadataFieldsEnum.payableBySc]: boolean;
}
export interface DeployUpgradeModalInitialValuesType {
  [DeployModalFormikFieldsEnum.gasLimit]: number;
  [MetadataFieldsEnum.readable]: boolean;
  [MetadataFieldsEnum.upgradeable]: boolean;
  [MetadataFieldsEnum.payable]: boolean;
  [MetadataFieldsEnum.payableBySc]: boolean;
}

export interface DeployUpgradeModalFormUIType extends UserInterfaceType {
  onSubmit: (values: DeployUpgradeModalInitialValuesType) => Promise<void>;
  isLoading: boolean;
  isUpgrade?: boolean;
  generalError?: string;
  buttonText?: string | React.ReactNode;
  panelDescription?: string | React.ReactNode;
}
