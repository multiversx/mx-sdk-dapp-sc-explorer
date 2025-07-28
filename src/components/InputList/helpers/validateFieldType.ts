import {
  AddressType,
  BigIntType,
  BigIntValue,
  BigUIntType,
  BigUIntValue,
  BooleanType,
  BooleanValue,
  BytesType,
  BytesValue,
  I16Type,
  I16Value,
  I32Type,
  I32Value,
  I64Type,
  I64Value,
  I8Type,
  I8Value,
  TokenIdentifierType,
  TokenIdentifierValue,
  Type,
  U16Type,
  U16Value,
  U32Type,
  U32Value,
  U64Type,
  U64Value,
  U8Type,
  U8Value,
  TypeMapper
} from 'lib/sdkCore';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';

// based on NativeSerializer, keep basic validation/error details before passing through to the NativeSerializer handler
// keep them split for now for easier error message maintenance
export function validateFieldType(
  native: any,
  unmappedType: Type,
  isOptional?: boolean
) {
  if (!native && isOptional) {
    return;
  }
  if (!native) {
    return 'Required';
  }

  if (!unmappedType) {
    return;
  }

  const mapper = new TypeMapper();
  const type = mapper.mapType(unmappedType);

  switch (type.constructor) {
    // AddressType
    case AddressType:
      if (addressIsValid(native)) {
        return;
      }
      return 'Invalid Address';
    // BooleanType
    case BooleanType:
      try {
        new BooleanValue(native);
        return;
      } catch {
        return 'Invalid Boolean Value';
      }
    // BytesType
    case BytesType:
      try {
        BytesValue.fromUTF8(native);
        return;
      } catch {
        return 'Invalid Bytes Value';
      }
    // TokenIdentifierType
    case TokenIdentifierType:
      try {
        new TokenIdentifierValue(native);
        return;
      } catch {
        return 'Invalid TokenIdentifier';
      }
    // NumericalType
    case U8Type:
      try {
        new U8Value(native);
        return;
      } catch {
        return 'Invalid u8 Value';
      }
    case I8Type:
      try {
        new I8Value(native);
        return;
      } catch {
        return 'Invalid i8 Value';
      }
    case U16Type:
      try {
        new U16Value(native);
        return;
      } catch {
        return 'Invalid u16 Value';
      }
    case I16Type:
      try {
        new I16Value(native);
        return;
      } catch {
        return 'Invalid i16 Value';
      }
    case U32Type:
      try {
        new U32Value(native);
        return;
      } catch {
        return 'Invalid u32 Value';
      }
    case I32Type:
      try {
        new I32Value(native);
        return;
      } catch {
        return 'Invalid i32 Value';
      }
    case U64Type:
      try {
        new U64Value(native);
        return;
      } catch {
        return 'Invalid u64 Value';
      }
    case I64Type:
      try {
        new I64Value(native);
        return;
      } catch {
        return 'Invalid i64 Value';
      }
    case BigUIntType:
      try {
        new BigUIntValue(native);
        return;
      } catch {
        return 'Invalid BigUInt';
      }
    case BigIntType:
      try {
        new BigIntValue(native);
        return;
      } catch {
        return 'Invalid BigInt';
      }
  }

  return;
}
