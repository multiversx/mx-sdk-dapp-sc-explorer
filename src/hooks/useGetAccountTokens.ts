import { ACCOUNT_TOKENS_SIZE } from 'constants/general';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import { useNetworkProvider } from 'hooks';
import { UserActionDispatchTypeEnum } from 'types';

export const useGetAccountTokens = () => {
  const userActionDispatch = useUserActionDispatch();
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
      size: ACCOUNT_TOKENS_SIZE,
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
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setAccountTokensState,
        accountTokens: response.data
      });
      return response.data;
    }

    return [];
  };

  return getTokens;
};
