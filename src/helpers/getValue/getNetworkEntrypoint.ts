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
  switch (network?.environment) {
    case EnvironmentsEnum.devnet:
      return new DevnetEntrypoint(network.apiAddress);
    case EnvironmentsEnum.testnet:
      return new TestnetEntrypoint(network.apiAddress);
    case EnvironmentsEnum.mainnet:
      return new MainnetEntrypoint(network.apiAddress);
  }

  return new MainnetEntrypoint();
};
