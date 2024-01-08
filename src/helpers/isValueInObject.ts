export function isValueInObject(obj: any, key: string, value: string) {
  try {
    JSON.stringify(obj, (_, nestedValue) => {
      if (nestedValue && nestedValue[key] === value) {
        throw nestedValue;
      }
      return nestedValue;
    });
  } catch (result) {
    return Boolean(result);
  }

  return false;
}
