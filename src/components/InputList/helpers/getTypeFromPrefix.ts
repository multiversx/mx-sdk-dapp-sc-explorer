import { TypeExpressionParser, Type } from 'lib/sdkCore';
import { TYPE_REGEX } from 'constants/general';

export const getTypeFromPrefix = (
  name?: string,
  currentPrefix?: string
): Type | undefined => {
  if (!name) {
    return undefined;
  }

  let cleanPrefix = name.replaceAll(TYPE_REGEX, '');
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
