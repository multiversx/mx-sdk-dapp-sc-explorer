import { UserInterfaceType } from 'types';

export interface DocsTooltipUIType extends UserInterfaceType {
  docs: string[];
  tooltipClassName?: string;
}
