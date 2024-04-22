import { AbiRegistry } from '@multiversx/sdk-core/out';

export const getDefinition = ({
  abiRegistry,
  isUpgrade
}: {
  abiRegistry?: AbiRegistry;
  isUpgrade?: boolean;
}) => {
  if (isUpgrade && abiRegistry?.endpoints) {
    const upgradeEndpoint = abiRegistry.endpoints.find(
      (endpoint) => endpoint.name === 'upgrade'
    );
    if (upgradeEndpoint) {
      return upgradeEndpoint;
    }
  }

  if (abiRegistry?.constructorDefinition) {
    return abiRegistry.constructorDefinition;
  }

  return;
};
