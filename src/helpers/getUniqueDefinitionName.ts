import { EndpointParameterDefinition } from '@multiversx/sdk-core/out';

export const getUniqueDefinitionName = ({
  definition,
  index
}: {
  definition?: EndpointParameterDefinition;
  index?: number;
}) => {
  const displayIndex = index !== undefined ? `:${index}` : '';
  try {
    return `${definition?.name}:${definition?.type?.getFullyQualifiedName()}${displayIndex}`.replaceAll(
      '.',
      '-'
    );
  } catch {}

  return `default${displayIndex}`;
};
