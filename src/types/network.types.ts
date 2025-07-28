import {
  DevnetEntrypoint,
  MainnetEntrypoint,
  TestnetEntrypoint
} from 'lib/sdkCore';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface NetworkType {
  environment: EnvironmentsEnum;
  networkEntrypoint: DevnetEntrypoint | TestnetEntrypoint | MainnetEntrypoint;
  provider?: 'api' | 'proxy';
  apiAddress?: string;
  proxyUrl?: string;
}
