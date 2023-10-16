import { TypeExpressionParser, Type } from '@multiversx/sdk-core/out';
import { TYPE_PREFIX } from 'constants/general';

export const getTypeFromPrefix = (
  name?: string,
  currentPrefix?: string
): Type | undefined => {
  if (!name) {
    return undefined;
  }

  let cleanPrefix = name.replaceAll(TYPE_PREFIX, '');
  if (currentPrefix) {
    cleanPrefix = cleanPrefix.replaceAll(currentPrefix, '');
  }

  try {
    const parsedType = new TypeExpressionParser().parse(cleanPrefix);
    return parsedType;
  } catch {
    return undefined;
  }
};
