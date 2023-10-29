import React, { useContext, ReactNode, createContext } from 'react';
import { AbiRegistry } from '@multiversx/sdk-core/out';

import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { SmartContractType, RawAbiType } from 'types';

export interface SmartContractContextPropsType extends SmartContractType {
  abiRegistry?: AbiRegistry;
  rawAbi?: RawAbiType;
}

interface SmartContractContextProviderPropsType {
  children: ReactNode;
  value: SmartContractContextPropsType;
}

export const SmartContractContext = createContext(
  {} as SmartContractContextPropsType
);

export function SmartContractContextProvider({
  children,
  value
}: SmartContractContextProviderPropsType) {
  const { abi, verifiedContract } = value;
  let abiRegistry = undefined;
  let rawAbi = undefined;
  if (verifiedContract?.source?.abi) {
    const verifiedContractAbi = verifiedContract.source.abi;
    rawAbi = verifiedContractAbi;
    try {
      if (!verifiedContractAbi.name) {
        verifiedContractAbi.name = INTERFACE_NAME_PLACEHOLDER;
      }
      abiRegistry = AbiRegistry.create(verifiedContractAbi);
    } catch (error) {
      console.error('Unable to parse abi: ', error);
    }
  }
  if (abi) {
    rawAbi = abi;
    try {
      abiRegistry = AbiRegistry.create(abi);
    } catch (error) {
      console.error('Unable to parse abi: ', error);
    }
  }

  const updatedValue = { ...value, rawAbi, abiRegistry };

  return (
    <SmartContractContext.Provider value={updatedValue}>
      {children}
    </SmartContractContext.Provider>
  );
}

export function useSmartContractContext() {
  return useContext(SmartContractContext);
}
