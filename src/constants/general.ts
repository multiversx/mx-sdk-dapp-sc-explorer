export const TIMEOUT = 10000;

/*-----------------------*/

export const CONTRACT_FILE_TEST_PATH = '/tests';
export const CONTRACT_FILE_EXTENSION = '.rs';
export const INTERFACE_NAME_PLACEHOLDER = '?';
export const INTERFACE_DESCRIPTION_PLACEHOLDER = 'N / A';

export const DOCUMENTED_TYPES = {
  u8: {
    type: 'integer',
    docs: 'something about it',
    example: 1
  },
  u16: {
    type: 'integer',
    docs: 'something about it',
    example: 12
  },
  u32: {
    type: 'integer',
    docs: 'something about it',
    example: 1234
  },
  u64: {
    type: 'integer',
    docs: 'something about it',
    example: 12345678
  },
  U64: {
    type: 'integer',
    docs: 'something about it',
    example: 12345678
  },
  BigUint: {
    type: 'string',
    validationType: 'numeric',
    docs: 'something about it',
    example: '10000000000000000000'
  },
  i8: {
    type: 'integer',
    docs: 'something about it',
    example: 1
  },
  i16: {
    type: 'integer',
    docs: 'something about it',
    example: 12
  },
  i32: {
    type: 'integer',
    docs: 'something about it',
    example: 1234
  },
  i64: {
    type: 'integer',
    docs: 'something about it',
    example: 12345678
  },
  Bigint: {
    type: 'string',
    inputType: 'numeric',
    docs: 'something about it',
    example: '10000000000000000000'
  },
  BigInt: {
    type: 'string',
    inputType: 'numeric',
    docs: 'something about it',
    example: '10000000000000000000'
  },
  bool: {
    type: 'boolean',
    docs: 'something about it',
    example: 'True'
  },
  bytes: {
    type: 'string',
    docs: 'something about it',
    example: 'Food for cats'
  },
  Address: {
    type: 'string',
    docs: 'something about it',
    example: 'erd1uapegx64zk6yxa9kxd2ujskkykdnvzlla47uawh7sh0rhwx6y60sv68me9'
  },
  H256: {
    type: 'buffer',
    docs: 'something about it',
    example: 'useful example'
  },
  'utf-8 string': {
    type: 'string',
    docs: 'something about it',
    example: 'Food for cats'
  },
  TokenIdentifier: {
    type: 'string',
    docs: 'something about it',
    example: 'USDC-c76f1f'
  },
  EgldOrEsdtTokenIdentifier: {
    type: 'string',
    docs: 'something about it',
    example: 'EGLD'
  },
  CodeMetadata: {
    type: 'CodeMetadata',
    docs: 'something about it'
  },
  nothing: {
    type: 'nothing',
    docs: 'something about it'
  },
  AsyncCall: {
    type: 'nothing',
    docs: 'something about it'
  }
};
