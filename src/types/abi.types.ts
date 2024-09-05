export interface RawAbiType {
  name: string;
  buildInfo: {
    contractCrate: {
      name: string;
      version: string;
    };
    framework: {
      name: string;
      version: string;
    };
    rustc: {
      channel: string;
      commitDate: string;
      commitHash: string;
      short: string;
      version: string;
    };
  };
  hasCallback: boolean;
  types: ContractTypingsType;
  endpoints?: ContractEndpointType[];
  events?: ContractEventType[];
  ['constructor']?: ContractConstructorType;
  isFromVerifiedContract?: boolean;
}

export interface ContractEndpointType {
  name: string;
  mutability?: ContractEndpointMutabilityEnum;
  onlyOwner?: boolean;
  docs?: string[];
  inputs?: ContractEndpointInputType[];
  outputs?: ContractOutputType[];
  payableInTokens?: string[];
}

export interface ContractEndpointInputType {
  name: string;
  type: string;
  multi_arg?: boolean;
}

export enum ContractEndpointMutabilityEnum {
  mutable = 'mutable',
  readonly = 'readonly'
}

export interface ContractEventType {
  identifier: string;
  inputs: ContractInputType[];
  outputs?: ContractOutputType[];
}

export interface ContractOutputType {
  type: string;
  multi_result?: boolean;
}

export interface ContractInputType {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface ContractFieldsType {
  name: string;
  type: string;
}

export interface ContractTypingsType {
  [key: string]: ContractTypingType;
}
export enum ContractTypingsTypeEnum {
  struct = 'struct',
  enum = 'enum',
  explicitEnum = 'explicit-enum'
}

export interface ContractTypingType {
  type: ContractTypingsTypeEnum;
  fields?: {
    name: string;
    type: string;
    docs?: string[];
  }[];
  variants?: {
    name: string;
    discriminant: string | number;
    fields?: ContractFieldsType[];
    docs?: string[];
  }[];
}

export interface ContractConstructorType {
  docs?: string[];
  inputs: ContractInputType[];
  outputs: ContractOutputType[];
}
