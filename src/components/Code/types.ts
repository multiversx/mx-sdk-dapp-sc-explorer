import { UserInterfaceType } from 'types';

export interface CodeUIType extends UserInterfaceType {
  code: string;
  language?: 'rust' | 'properties';
  showLineNumbers?: boolean;
  wrapLongLines?: boolean;
}
