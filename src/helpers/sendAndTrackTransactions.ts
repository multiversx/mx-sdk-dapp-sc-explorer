import { TransactionManager, TransactionsDisplayInfoType } from 'lib';
import { Transaction } from 'lib/sdkCore';

type SendAndTrackTransactionsType = {
  transactions: Transaction[] | Transaction[][];
  options?: {
    disableToasts?: boolean;
    transactionsDisplayInfo?: TransactionsDisplayInfoType;
  };
};

export const sendAndTrackTransactions = async ({
  transactions,
  options
}: SendAndTrackTransactionsType) => {
  const txManager = TransactionManager.getInstance();

  const sentTransactions = await txManager.send(transactions);
  const sessionId = await txManager.track(sentTransactions, options);

  return sessionId;
};
