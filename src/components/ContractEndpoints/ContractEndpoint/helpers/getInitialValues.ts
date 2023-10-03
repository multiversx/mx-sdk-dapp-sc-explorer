import { EndpointParameterDefinition } from '@multiversx/sdk-core/out';
import { getUniqueDefinitionName } from 'helpers';

export const getInitialValues = (input?: EndpointParameterDefinition[]) => {
  if (!input || input.length === 0) {
    return {};
  }

  return Object.fromEntries(
    input.map((definition, index) => {
      const upperBound = definition?.type?.getCardinality()?.getUpperBound();
      const uniqueName = getUniqueDefinitionName({ definition, index });
      return [uniqueName ?? 'default', upperBound === 1 ? '' : ['']];
    })
  );
};
