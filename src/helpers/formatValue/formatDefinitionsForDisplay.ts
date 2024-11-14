import { FieldDefinition } from '@multiversx/sdk-core/out/smartcontracts';

export const formatDefinitionsForDisplay = (definitions: FieldDefinition[]) => {
  if (definitions.length === 0) {
    return '';
  }

  const formattedDefinitions =
    Object.fromEntries(
      definitions.map((definition) => [
        definition?.name,
        definition?.type?.getName()
      ])
    ) ?? {};

  return JSON.stringify(formattedDefinitions, null, 2)
    .replaceAll(': ""', '')
    .replaceAll('"', '')
    .replaceAll(': ,', ',');
};
