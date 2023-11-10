import { UserInterfaceType } from 'types';
import { VerifiedContractTabsEnum } from 'types';

export interface LayoutComponentUIType extends UserInterfaceType {
  activeSection: VerifiedContractTabsEnum;
}
