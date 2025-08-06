import { useState } from 'react';

import { getStore, TransactionManager, transactionsSliceSelector } from 'lib';

export const useTrackTransaction = (sessionId: string = '0') => {
  const store = getStore();
  const allTransactionSessions = transactionsSliceSelector(store.getState());
  const currentSession = allTransactionSessions[sessionId];
  const currentTransaction = currentSession?.transactions?.[0];
  const currentTransactionStatus = currentTransaction?.status;

  const [txProcessingFinished, setTxProcessingFinished] = useState(false);

  const onTransactionStateChange = async () => {
    setTxProcessingFinished(true);
  };

  const txManager = TransactionManager.getInstance();
  txManager.setCallbacks({
    onFail: onTransactionStateChange,
    onSuccess: onTransactionStateChange
  });

  return {
    txProcessingFinished,
    status: currentTransactionStatus,
    transactions: currentSession?.transactions
  };
};
