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

  const generalEntrypointConfig = {
    url: network.apiAddress,
    kind: 'api',
    clientName: CLIENT_NAME,
    withGasLimitEstimator: true
  };
  switch (network?.environment) {
    case EnvironmentsEnum.testnet:
      return new TestnetEntrypoint(generalEntrypointConfig);
    case EnvironmentsEnum.mainnet:
      return new MainnetEntrypoint(generalEntrypointConfig);
    case EnvironmentsEnum.devnet:
    default:
      return new DevnetEntrypoint(generalEntrypointConfig);
  }
};
