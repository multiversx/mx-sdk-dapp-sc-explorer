import { NetworkType as NetworkConfigType } from '@multiversx/sdk-dapp/types/network.types';

export interface NetworkType extends Partial<NetworkConfigType> {
  provider: 'api' | 'proxy';
  accessToken?: boolean;
  proxyUrl?: string;
}
