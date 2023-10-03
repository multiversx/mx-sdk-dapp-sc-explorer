import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/index';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

export const testNetwork =
  fallbackNetworkConfigurations[EnvironmentsEnum.devnet];

export const testContract =
  'erd1qqqqqqqqqqqqqpgq0zhaypvranynclv23dv3ykq5535jetz97yyswyx337';
