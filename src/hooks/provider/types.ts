import { ContractQueryResponse } from 'lib';

export interface BasicPropsType {
  baseUrl?: ProviderPropsType['baseUrl'];
  proxyUrl?: ProviderPropsType['proxyUrl'];
  url?: string;
  params?: ProviderPropsType['params'];
  request?: ProviderPropsType['request'];
  timeout?: ProviderPropsType['timeout'];
}

export type ProviderType = (
  props: ProviderPropsType & { url?: string }
) => Promise<any>;

export interface ProviderPropsType {
  baseUrl: string;
  proxyUrl?: string;
  metaChainShardId?: number;
  url?: string;
  params?: any;
  request?: any;
  timeout: number;
  timestamp?: number;
}

export interface QueryContractResponse extends ContractQueryResponse {
  parsedResponse?: any[];
}

export type ApiProviderResponseType =
  | {
      success: boolean;
      data: any;
      error?: string;
    }
  | {
      success: boolean;
      data?: undefined;
      error?: string;
    };
