import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';
import { NetworkType as NetworkConfigType } from '@multiversx/sdk-dapp/types/network.types';

export interface NetworkType {
  environment: EnvironmentsEnum;
  provider?: 'api' | 'proxy';
  apiAddress?: string;
  proxyUrl?: string;
  customNetworkConfig?: NetworkConfigType;
}
