import {
  DevnetEntrypoint,
  MainnetEntrypoint,
  TestnetEntrypoint
} from '@multiversx/sdk-core/out';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export interface NetworkType {
  environment: EnvironmentsEnum;
  networkEntrypoint: DevnetEntrypoint | TestnetEntrypoint | MainnetEntrypoint;
  provider?: 'api' | 'proxy';
  apiAddress?: string;
  proxyUrl?: string;
}
