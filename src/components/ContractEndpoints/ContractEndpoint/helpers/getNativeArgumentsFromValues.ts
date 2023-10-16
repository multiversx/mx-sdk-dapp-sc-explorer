import { FormikAbiType } from 'types';

export const getNativeArgumentsFromValues = (values: FormikAbiType): any[] => {
  try {
    const flattenHelped = flattenValues(values);
    const flattenedArray = flattenNestedResultArray(flattenHelped);
    const nativeArgs = prepareArgs(flattenedArray);
    return nativeArgs;
  } catch {
    return [];
  }
};

function flattenValues(innerObj: any): any {
  if (Array.isArray(innerObj)) {
    return innerObj.map((obj) => flattenValues(obj));
  } else if (typeof innerObj === 'object' && innerObj !== null) {
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
      result.push(prepareArgs(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
