import { useSCExplorerContext } from 'contexts';

export const useGetContractDocs = () => {
  const { smartContract } = useSCExplorerContext();
  const { rawAbi } = smartContract;
  const docs = rawAbi?.['constructor']?.docs ? rawAbi['constructor'].docs : [];

  return docs;
};
