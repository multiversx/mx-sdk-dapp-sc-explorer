import { TIMEOUT } from 'constants/general';
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
    const errorResponse = (err as any)?.response?.data;
    const error = errorResponse
      ? `${errorResponse?.code}${
          errorResponse?.message ? `: ${errorResponse.message}` : ''
        }`
      : '';

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
