import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface NetworkType {
  environment: EnvironmentsEnum;
  provider?: 'api' | 'proxy';
  apiAddress?: string;
  proxyUrl?: string;
}
