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
  isUpgrade?: boolean;
  onSubmit: (values: DeployUpgradeModalInitialValuesType) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  generalError?: string;
  successText?: string | React.ReactNode;
  buttonText?: string | React.ReactNode;
  panelDescription?: string | React.ReactNode;
  sessionId?: string;
}
