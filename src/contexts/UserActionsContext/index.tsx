import React, {
  createContext,
  useReducer,
  useContext,
  PropsWithChildren
} from 'react';

import { reducer } from './reducer';
import { initializer } from './state';
import { UserActionDispatchType, UserActionStateType } from './types';

const Context = createContext<UserActionStateType | undefined>(undefined);
const Dispatch = createContext<UserActionDispatchType | undefined>(undefined);

const UserActionsContextProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initializer);

  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </Context.Provider>
  );
};

const useUserActionsContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      'The useScContext hook must be used within a Context.Provider.'
    );
  } else {
    return context;
  }
};

const useUserActionDispatch = () => {
  const context = useContext(Dispatch);

  if (context === undefined) {
    throw new Error(
      'The useUserActionDispatch hook must be used within a Dispatch.Provider.'
    );
  } else {
    return context;
  }
};

export {
  UserActionsContextProvider,
  useUserActionsContext,
  useUserActionDispatch
};
