import React, {
  createContext,
  useEffect,
  useReducer,
  useContext,
  ReactNode
} from 'react';

import { ConfigType } from 'types';
import { reducer } from './reducer';
import { initializer } from './state';
import {
  ConfigDispatchType,
  ConfigDispatchTypeEnum,
  ConfigStateType
} from './types';

export interface ConfigContextProviderPropsType {
  children: ReactNode;
  value: ConfigType;
}

const Context = createContext<ConfigStateType | undefined>(undefined);
const Dispatch = createContext<ConfigDispatchType | undefined>(undefined);

const ConfigContextProvider = ({
  children,
  value
}: ConfigContextProviderPropsType) => {
  const {
    canLoadAbi = false,
    canMutate = false,
    canDeploy = false,
    canUpgrade = false,
    canDisplayContractDetails = false,
    loginParams
  } = value;

  const [state, dispatch] = useReducer(reducer, initializer);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setCanLoadAbi,
      canLoadAbi
    });
  }, [canLoadAbi]);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setCanMutate,
      canMutate
    });
  }, [canMutate]);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setCanDeploy,
      canDeploy
    });
  }, [canDeploy]);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setCanUpgrade,
      canUpgrade
    });
  }, [canUpgrade]);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setCanDisplayContractDetails,
      canDisplayContractDetails
    });
  }, [canDisplayContractDetails]);

  useEffect(() => {
    dispatch({
      type: ConfigDispatchTypeEnum.setLoginParams,
      loginParams
    });
  }, [loginParams]);

  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </Context.Provider>
  );
};

const useConfigContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      'The useScContext hook must be used within a Context.Provider.'
    );
  } else {
    return context;
  }
};

const useConfigDispatch = () => {
  const context = useContext(Dispatch);

  if (context === undefined) {
    throw new Error(
      'The useConfigDispatch hook must be used within a Dispatch.Provider.'
    );
  } else {
    return context;
  }
};

export { ConfigContextProvider, useConfigContext, useConfigDispatch };
