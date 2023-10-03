import { RawAbiType } from './abi.types';

export interface VerifiedContractType {
  codeHash: string;
  source: {
    abi: RawAbiType;
    contract: ContractType;
  };
  status: string;
  ipfsFileHash: string;
  dockerImage: string;
}

export interface ContractType {
  entries: ContractFileType[];
  name: string;
  version: string;
}

export interface ContractFileType {
  content: string;
  path: string;
  module: string;
  dependencyDepth: number;
  isTestFile: boolean;
}

export enum VerifiedContractTabsEnum {
  details = 'details',
  sourceCode = 'source',
  endpoints = 'endpoints',
  readEndpoints = 'endpoints-read',
  writeEndpoints = 'endpoints-write',
  events = 'events',
  types = 'types',
  contractConstructor = 'constructor'
}
