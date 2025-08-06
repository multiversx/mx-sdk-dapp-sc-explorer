import {
  DocumentedTypesExampleType,
  MetadataFieldsEnum,
  MetadataOptionsType,
  ContractPropertiesEnum
} from 'types';

export const TIMEOUT = 10000;
export const SC_GAS_LIMIT = 10_000_000;
export const SC_DEPLOY_GAS_LIMIT = 600_000_000;
export const SC_SIMULATE_GAS_LIMIT = 1_000_000_000;
export const ZERO = 0;
export const ACCOUNT_TOKENS_SIZE = 200;

/*-----------------------*/

export const CLIENT_NAME = 'sdk-dapp-sc-explorer';

export const CONTRACT_FILE_TEST_PATH = '/tests';
export const CONTRACT_FILE_EXTENSION = '.rs';
export const INTERFACE_NAME_PLACEHOLDER = '?';
export const INTERFACE_DESCRIPTION_PLACEHOLDER = 'N / A';
export const CONTRACT_WRITE_ENDPOINT_HIDE_LIST = ['upgrade'];
export const TYPE_PREFIX = 'multiversx:types:';
export const CUSTOM_TYPE_PREFIX = 'customType:';
export const TYPE_REGEX =
  /(customType:)?([a-z_:]+:)?(?:\d+:)?multiversx:types:/g;
export const TYPE_PREFIX_REGEX =
  /^(customType:)?([a-z_:]+:)?(?:\d+:)?multiversx:types:/;

export const METADATA_OPTIONS: MetadataOptionsType = {
  [MetadataFieldsEnum.upgradeable]: {
    label: ContractPropertiesEnum.upgradeable,
    checked: true
  },
  [MetadataFieldsEnum.readable]: {
    label: ContractPropertiesEnum.readable,
    checked: true
  },
  [MetadataFieldsEnum.payable]: {
    label: ContractPropertiesEnum.payable,
    checked: false
  },
  [MetadataFieldsEnum.payableBySc]: {
    label: ContractPropertiesEnum.payableBySc,
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

export const OperationCompletionStatus = {
  type: 'explicit-enum',
  variants: [
    {
      docs: ['indicates that operation was completed'],
      name: 'completed'
    },
    {
      docs: [
        'indicates that operation was interrupted prematurely, due to low gas'
      ],
      name: 'interrupted'
    }
  ]
};
