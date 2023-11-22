import { Type } from '@multiversx/sdk-core/out';

function cleanName(inputString: string) {
  const regex = /\w*multiversx:types:.*/;
  const match = inputString.match(regex);

  if (match) {
    return match[0];
  } else {
    return '';
  }
}

export const getNestedType = ({
  inputType,
  searchedType
}: {
  inputType: Type;
  searchedType: string;
}): Type | undefined => {
  const findNestedType: any = (arr: Type[], fullyQualifiedName: string) =>
    arr.reduce((acc: any, type: Type) => {
      if (acc) {
        return acc;
      }
      if (type.getFullyQualifiedName() === fullyQualifiedName) {
        return type;
      }
      if (type.getTypeParameters().length > 0) {
        return findNestedType(type.getTypeParameters(), fullyQualifiedName);
      }
    }, null);

  return findNestedType([inputType], cleanName(searchedType));
};
