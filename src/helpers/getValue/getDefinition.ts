import { AbiRegistry } from 'lib/sdkCore';

export const getDefinition = ({
  abiRegistry,
  isUpgrade
}: {
  abiRegistry?: AbiRegistry;
  isUpgrade?: boolean;
}) => {
  if (isUpgrade) {
    if (abiRegistry?.endpoints) {
      const upgradeEndpoint = abiRegistry.endpoints.find(
        (endpoint) => endpoint.name === 'upgrade'
      );
      if (upgradeEndpoint) {
        return upgradeEndpoint;
      }
    }

    if (abiRegistry?.upgradeConstructorDefinition) {
      return abiRegistry.upgradeConstructorDefinition;
    }

    return;
  }

  if (abiRegistry?.constructorDefinition) {
    return abiRegistry.constructorDefinition;
  }

  return;
};
