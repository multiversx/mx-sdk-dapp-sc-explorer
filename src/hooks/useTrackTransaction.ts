import { useState } from 'react';
import { useTrackTransactionStatus } from '@multiversx/sdk-dapp/hooks/transactions/useTrackTransactionStatus';

export const useTrackTransaction = (sessionId: string = '0') => {
  const [txProcessingFinished, setTxProcessingFinished] = useState(false);

  const onTransactionStateChange = () => {
    setTxProcessingFinished(true);
  };
  const transactionStatus = useTrackTransactionStatus({
    onCancelled: onTransactionStateChange,
    onFail: onTransactionStateChange,
    onSuccess: onTransactionStateChange,
    onTimedOut: onTransactionStateChange,
    transactionId: sessionId
  });
  const { status, transactions } = transactionStatus;

  return { txProcessingFinished, status, transactions };
};
