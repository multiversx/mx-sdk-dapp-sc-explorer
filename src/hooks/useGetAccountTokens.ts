import { useSCExplorerContext, useDispatch } from 'contexts';
import { useNetworkProvider } from 'hooks';
import { ActionTypeEnum } from 'types';

export const useGetAccountTokens = () => {
  const dispatch = useDispatch();
  const { get } = useNetworkProvider();
  const { accountInfo, userActionsState } = useSCExplorerContext();
  const { address } = accountInfo ?? {};
  const { accountTokens } = userActionsState ?? { accountTokens: [] };

  const getTokens = async (tokens: string[] = []) => {
    const fields = [
      'identifier',
      'name',
      'balance',
      'ticker',
      'assets',
      'decimals',
      'type',
      'price',
      'nonce'
    ].join(',');
    const identifiers = tokens.includes('*') ? '' : tokens.join(',');
    const params = {
      size: 100,
      includeMetaESDT: true,
      fields,
      ...(identifiers ? { identifiers } : {})
    };

    if (tokens.length > 0 && accountTokens && accountTokens.length > 0) {
      const areTokensInState = accountTokens.every(
        ({ identifier }) => tokens.includes(identifier) || tokens.includes('*')
      );

      if (areTokensInState) {
        return accountTokens;
      }
    }

    const url = `accounts/${address}/tokens`;
    const response = await get({ url, params });
    if (response?.success && response?.data && response.data.length > 0) {
      dispatch({
        type: ActionTypeEnum.setAccountTokensState,
        accountTokens: response.data
      });
      return response.data;
    }

    return [];
  };

  return getTokens;
};
