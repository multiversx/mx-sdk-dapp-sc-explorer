import React, {
  createContext,
  useEffect,
  useReducer,
  useContext,
  ReactNode
} from 'react';

import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { getAbiRegistry } from 'helpers';
import { SmartContractConfigType } from 'types';
import { reducer } from './reducer';
import { initializer } from './state';
import {
  SmartContractDispatchType,
  SmartContractDispatchTypeEnum,
  SmartContractStateType
} from './types';

export interface SmartContractContextProviderPropsType {
  children: ReactNode;
  value: SmartContractConfigType;
}

const Context = createContext<SmartContractStateType | undefined>(undefined);
const Dispatch = createContext<SmartContractDispatchType | undefined>(
  undefined
);

const SmartContractContextProvider = ({
  children,
  value
}: SmartContractContextProviderPropsType) => {
  const { abi, verifiedContract, deployedContractDetails } = value;

  const [state, dispatch] = useReducer(reducer, initializer);

  useEffect(() => {
    if (deployedContractDetails) {
      dispatch({
        type: SmartContractDispatchTypeEnum.setContractAddress,
        contractAddress: deployedContractDetails.address
      });
      dispatch({
        type: SmartContractDispatchTypeEnum.setDeployedContractDetails,
        deployedContractDetails
      });
    }
  }, [deployedContractDetails]);

  useEffect(() => {
    if (verifiedContract) {
      dispatch({
        type: SmartContractDispatchTypeEnum.setVerifiedContract,
        verifiedContract
      });
      if (verifiedContract?.source?.abi) {
        const verifiedContractAbi = verifiedContract.source.abi;
        dispatch({
          type: SmartContractDispatchTypeEnum.setRawAbi,
          rawAbi: verifiedContractAbi
        });

        try {
          if (!verifiedContractAbi.name) {
            verifiedContractAbi.name = INTERFACE_NAME_PLACEHOLDER;
          }
          const abiRegistry = getAbiRegistry(verifiedContractAbi);
          dispatch({
            type: SmartContractDispatchTypeEnum.setAbiRegistry,
            abiRegistry
          });
        } catch (error) {
          console.error('Unable to parse Verified Contract ABI: ', error);
        }
      }
    }
  }, [verifiedContract]);

  useEffect(() => {
    if (abi) {
      dispatch({
        type: SmartContractDispatchTypeEnum.setRawAbi,
        rawAbi: abi
      });
      try {
        if (!abi.name) {
          abi.name = INTERFACE_NAME_PLACEHOLDER;
        }
        const abiRegistry = getAbiRegistry(abi);
        dispatch({
          type: SmartContractDispatchTypeEnum.setAbiRegistry,
          abiRegistry
        });
      } catch (error) {
        console.error('Unable to parse ABI: ', error);
      }
    }
  }, [abi]);

  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </Context.Provider>
  );
};

const useSmartContractContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      'The useScContext hook must be used within a Context.Provider.'
    );
  } else {
    return context;
  }
};

const useSmartContractDispatch = () => {
  const context = useContext(Dispatch);

  if (context === undefined) {
    throw new Error(
      'The useSmartContractDispatch hook must be used within a Dispatch.Provider.'
    );
  } else {
    return context;
  }
};

export {
  SmartContractContextProvider,
  useSmartContractContext,
  useSmartContractDispatch
};
