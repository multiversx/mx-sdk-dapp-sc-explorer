import { EnvironmentsEnum } from 'lib';
import {
  DevnetEntrypoint,
  MainnetEntrypoint,
  TestnetEntrypoint
} from 'lib/sdkCore';

export interface NetworkType {
  environment: EnvironmentsEnum;
  networkEntrypoint: DevnetEntrypoint | TestnetEntrypoint | MainnetEntrypoint;
  provider?: 'api' | 'proxy';
  apiAddress?: string;
  proxyUrl?: string;
}
