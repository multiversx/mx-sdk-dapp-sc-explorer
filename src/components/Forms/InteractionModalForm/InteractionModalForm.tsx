import React from 'react';
import { useSCExplorerContext } from 'contexts';
import { InteractionModalFormUIType } from 'types';
import { InteractionForm } from '../InteractionForm';

export const InteractionModalForm = (props: InteractionModalFormUIType) => {
  const { isUpgrade = false, isDeploy = false, isMutate = false } = props;
  const { accountInfo, userActionsState } = useSCExplorerContext();

  const {
    deployModalState,
    upgradeModalState,
    mutateModalState,
    accountTokens
  } = userActionsState;

  const currentModalState =
    (isUpgrade && upgradeModalState ? upgradeModalState : undefined) ||
    (isDeploy && deployModalState ? deployModalState : undefined) ||
    (isMutate && mutateModalState ? mutateModalState : undefined);

  const { code, endpoint, args } = currentModalState ?? {};
  const { isLoggedIn } = accountInfo;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <InteractionForm
      {...props}
      code={code}
      endpoint={endpoint}
      args={args}
      tokens={accountTokens}
    />
  );
};
