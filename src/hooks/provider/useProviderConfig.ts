import axios from 'axios';

import { ERROR_MESSAGE_MAX_LENGTH, TIMEOUT } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { apiProvider } from './api';
import { proxyProvider } from './proxy';
import { BasicPropsType, ApiProviderResponseType } from './types';

async function wrap(asyncRequest: () => Promise<ApiProviderResponseType>) {
  try {
    const { data } = await asyncRequest();
    return {
      data,
      success: data !== undefined,
      error: undefined
    };
  } catch (err) {
    const errorResponse =
      axios.isAxiosError(err) && typeof err.response?.data === 'object'
        ? (err.response.data as Record<string, unknown>)
        : undefined;

    const code =
      typeof errorResponse?.code === 'string' ? errorResponse.code : '';
    const message =
      typeof errorResponse?.message === 'string' ? errorResponse.message : '';

    const error = [code, message]
      .filter(Boolean)
      .join(': ')
      .slice(0, ERROR_MESSAGE_MAX_LENGTH);

    return {
      success: false,
      ...(error ? { error } : {})
    };
  }
}

export const useProviderConfig = () => {
  const { networkConfig } = useSCExplorerContext();
  const { provider: networkProvider } = networkConfig;

  const providers = {
    api: {
      baseUrl: networkConfig?.apiAddress || '',
      url: 'query',
      ...apiProvider
    },
    proxy: {
      baseUrl: networkConfig?.proxyUrl || '',
      url: 'vm-values/query',
      ...proxyProvider
    }
  };

  const setProvider = networkProvider ?? 'api';

  const { get, post } = providers[setProvider];

  const providerProps = {
    ...providers[setProvider],
    timeout: TIMEOUT
  };

  const basicProps: BasicPropsType & { url?: string } = { url: '' };

  return {
    get: (props = basicProps) =>
      wrap(() => get({ ...providerProps, ...props })),
    post: (props = basicProps) =>
      wrap(() => post({ ...providerProps, ...props }))
  };
};
