import {
  DocumentedTypesExampleType,
  MetadataFieldsEnum,
  MetadataOptionsType
} from 'types';

export const TIMEOUT = 10000;
export const SC_GAS_LIMIT = 50_000_000;
export const ZERO = 0;

/*-----------------------*/

export const CONTRACT_FILE_TEST_PATH = '/tests';
export const CONTRACT_FILE_EXTENSION = '.rs';
export const INTERFACE_NAME_PLACEHOLDER = '?';
export const INTERFACE_DESCRIPTION_PLACEHOLDER = 'N / A';
export const TYPE_PREFIX = 'multiversx:types:';
export const CUSTOM_TYPE_PREFIX = 'customType:';
export const TYPE_REGEX =
  /(customType:)?([a-z_:]+:)?(?:\d+:)?multiversx:types:/g;
export const TYPE_PREFIX_REGEX =
  /^(customType:)?([a-z_:]+:)?(?:\d+:)?multiversx:types:/;

export const METADATA_OPTIONS: MetadataOptionsType = {
  [MetadataFieldsEnum.upgradeable]: {
    label: 'Upgradeable',
    checked: true
  },
  [MetadataFieldsEnum.readable]: {
    label: 'Readable',
    checked: true
  },
  [MetadataFieldsEnum.payable]: {
    label: 'Payable',
    checked: false
  },
  [MetadataFieldsEnum.payableBySc]: {
    label: 'Payable By Smart Contract',
    checked: true
  }
};

export const DOCUMENTED_TYPES: { [key: string]: DocumentedTypesExampleType } = {
  u8: {
    type: 'integer',
    example: 1
  },
  u16: {
    type: 'integer',
    example: 12
  },
  u32: {
    type: 'integer',
    example: 1234
  },
  u64: {
    type: 'integer',
    example: 12345678
  },
  U64: {
    type: 'integer',
    example: 12345678
  },
  BigUint: {
    type: 'string',
    validationType: 'numeric',
    example: '10000000000000000000'
  },
  i8: {
    type: 'integer',
    example: 1
  },
  i16: {
    type: 'integer',
    example: 12
  },
  i32: {
    type: 'integer',
    example: 1234
  },
  i64: {
    type: 'integer',
    example: 12345678
  },
  Bigint: {
    type: 'string',
    inputType: 'numeric',
    example: '10000000000000000000'
  },
  BigInt: {
    type: 'string',
    inputType: 'numeric',
    example: '10000000000000000000'
  },
  bool: {
    type: 'boolean',
    example: 'True'
  },
  bytes: {
    type: 'string',
    example: 'String'
  },
  Address: {
    type: 'string',
    example: 'erd1uapegx64zk...hwx6y60sv68me9'
  },
  H256: {
    type: 'buffer'
  },
  'utf-8 string': {
    type: 'string',
    example: 'String'
  },
  TokenIdentifier: {
    type: 'string',
    example: 'USDC-c76f1f'
  },
  EgldOrEsdtTokenIdentifier: {
    type: 'string',
    example: 'EGLD'
  },
  CodeMetadata: {
    type: 'CodeMetadata'
  },
  nothing: {
    type: 'nothing'
  },
  AsyncCall: {
    type: 'nothing'
  }
};
