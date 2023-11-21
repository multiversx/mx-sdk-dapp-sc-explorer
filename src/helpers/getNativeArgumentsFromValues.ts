import { CUSTOM_TYPE_PREFIX } from 'constants/general';
import { FormikAbiType } from 'types';

export const getNativeArgumentsFromValues = (values: FormikAbiType): any[] => {
  try {
    const flattenHelped = flattenValues(values);
    const flattenedArray = flattenNestedResultArray(flattenHelped);
    const nativeArgs = prepareArgs(flattenedArray);
    const validArgs = nativeArgs.filter((arg) => arg !== undefined);

    return validArgs;
  } catch {
    return [];
  }
};

function flattenValues(innerObj: any): any {
  if (Array.isArray(innerObj)) {
    return innerObj.map((obj) => flattenValues(obj));
  } else if (typeof innerObj === 'object' && innerObj !== null) {
    const objKeys = Object.keys(innerObj);
    const isCustomType = objKeys.every((key) =>
      key.startsWith(CUSTOM_TYPE_PREFIX)
    );
    if (isCustomType) {
      // handle customTypes
      const processedObject = Object.fromEntries(
        Object.entries(innerObj).map(([k, v]) => {
          const key = k.split(':')?.[1];
          const processedValue = flattenValues(v);
          if (Array.isArray(processedValue)) {
            const flattenedArray = flattenNestedResultArray(processedValue);
            const flatArgs = prepareArgs(flattenedArray);
            return [key, flatArgs];
          }
          return [key, processedValue];
        })
      );
      return processedObject;
    }
    const values = Object.values(innerObj);
    return values.map((obj) => flattenValues(obj));
  } else {
    if (innerObj) {
      return innerObj;
    }
  }
}

function flattenNestedResultArray(nestedArray: any[]) {
  let result: any[] = [];
  for (let i = 0; i < nestedArray.length; i++) {
    if (Array.isArray(nestedArray[i][0])) {
      result = result.concat(flattenNestedResultArray(nestedArray[i]));
    } else {
      result.push(nestedArray[i]);
    }
  }
  return result;
}

function prepareArgs(arr: any[]) {
  const result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i]) && arr[i].length === 1) {
      result.push(arr[i][0]);
    } else if (Array.isArray(arr[i])) {
      if (arr[i].length > 0) {
        result.push(prepareArgs(arr[i]));
      }
    } else {
      if (!isObjectEmpty(arr[i])) {
        result.push(arr[i]);
      }
    }
  }
  return result;
}

function isObjectEmpty(objectName: any) {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
}
