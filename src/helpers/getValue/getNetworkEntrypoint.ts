import { CLIENT_NAME } from 'constants/general';
import { EnvironmentsEnum } from 'lib';
import {
  DevnetEntrypoint,
  MainnetEntrypoint,
  TestnetEntrypoint
} from 'lib/sdkCore';
import { NetworkType } from 'types';

export const getNetworkEntrypoint = ({
  network
}: {
  network?: NetworkType;
}) => {
  if (!network) {
    return new DevnetEntrypoint();
  }

  // config for sdk-js v15
  // const generalEntrypointConfig = {
  //   url: network.apiAddress,
  //   kind: 'api',
  //   clientName: CLIENT_NAME,
  //   withGasLimitEstimator: true
  // };
  switch (network?.environment) {
    case EnvironmentsEnum.testnet:
      return new TestnetEntrypoint(network.apiAddress, 'api', CLIENT_NAME);
    case EnvironmentsEnum.mainnet:
      return new MainnetEntrypoint(network.apiAddress, 'api', CLIENT_NAME);
    default:
    case EnvironmentsEnum.devnet:
      return new DevnetEntrypoint(network.apiAddress, 'api', CLIENT_NAME);
  }
};
