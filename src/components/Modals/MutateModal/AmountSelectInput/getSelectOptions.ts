import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { getEgldLabel } from '@multiversx/sdk-dapp/utils/network/getEgldLabel';

import { SelectOptionType, EsdtType } from 'types';

export const getSelectOptions = ({
  tokens = [],
  includeEgld = false,
  egldBalance = '0',
  wrappedEgldIdentifier = ''
}: {
  tokens?: EsdtType[];
  includeEgld?: boolean;
  egldBalance?: string;
  wrappedEgldIdentifier?: string;
}) => {
  const egldLabel = getEgldLabel();
  const egldFamily = [egldLabel];
  if (wrappedEgldIdentifier && !egldFamily.includes(wrappedEgldIdentifier)) {
    egldFamily.push(wrappedEgldIdentifier);
  }
  const options: SelectOptionType[] = [];

  const sortOptions = (opts: SelectOptionType[]) => {
    const sortedByName = opts.sort((a, b) =>
      a.value < b.value ? -1 : a.value > b.value ? 1 : 0
    );

    let sorted = sortedByName.filter(
      ({ value }) => !egldFamily.includes(value)
    );

    const wegldToken = opts.find(
      ({ value }) => value === wrappedEgldIdentifier
    );
    const egldToken = opts.find(({ value }) => value === egldLabel);

    if (wegldToken) {
      sorted = [wegldToken, ...sorted];
    }

    if (egldToken) {
      sorted = [egldToken, ...sorted];
    }

    return sorted;
  };

  if (includeEgld) {
    const hasEgld = tokens?.filter((token) => token?.identifier === egldLabel);
    if (hasEgld.length === 0) {
      tokens.push({
        name: egldLabel,
        identifier: egldLabel,
        ticker: egldLabel,
        owner: 'erd1...',
        decimals: DECIMALS,
        balance: egldBalance,
        type: 'native'
      });
    }
  }

  tokens.forEach((token) => {
    const tokenAsOption = {
      label: token.ticker,
      value: token.identifier,
      assets: token.assets,
      token
    };

    options.push(tokenAsOption);
  });

  return sortOptions(options);
};
