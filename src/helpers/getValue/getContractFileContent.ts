import { ContractFileType } from 'types';

export const getContractFileContent = (file: ContractFileType) => {
  const { content } = file;

  try {
    const base64Buffer = Buffer.from(content, 'base64');
    const codeString = base64Buffer.toString();

    return codeString;
  } catch (error) {
    console.error('Unable to decode Verified Contract File: ', error);

    return '';
  }
};
