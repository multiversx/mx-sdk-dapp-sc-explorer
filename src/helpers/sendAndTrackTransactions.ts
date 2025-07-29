import {
  getAccountProvider,
  TransactionManager,
  TransactionsDisplayInfoType
} from 'lib';
import { Transaction } from 'lib/sdkCore';

type SendAndTrackTransactionsType = {
  transactions: Transaction[];
  options?: {
    disableToasts?: boolean;
    transactionsDisplayInfo?: TransactionsDisplayInfoType;
  };
};

export const sendAndTrackTransactions = async ({
  transactions: transactionsToSend,
  options
}: SendAndTrackTransactionsType) => {
  const provider = getAccountProvider();
  const transactions = await provider.signTransactions(transactionsToSend);

  const txManager = TransactionManager.getInstance();

  const sentTransactions = await txManager.send(transactions);
  const sessionId = await txManager.track(sentTransactions, options);

  return sessionId;
};
