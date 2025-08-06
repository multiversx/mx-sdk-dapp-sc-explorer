import React from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { ProviderTypeEnum, UnlockPanelManager } from 'lib';
import {
  LoginButtonWrapperUIType,
  ContractEndpointMutabilityEnum
} from 'types';

export const LoginButtonWrapperComponent = (
  props: LoginButtonWrapperUIType
) => {
  const {
    mutability,
    children,
    buttonDescription,
    className,
    'data-testid': dataTestId,
    globalStyles,
    styles
  } = props;
  const { accountInfo, customClassNames, icons } = useSCExplorerContext();
  const { isLoggedIn, address, onLoginClick } = accountInfo;

  const { connectIcon = faBolt } = icons ?? {};

  const loginHandler = () => {
    // NOT USED. disable autologout
    // LogoutManager.getInstance().stop();
  };

  const allowedProviders = [
    ProviderTypeEnum.ledger,
    ProviderTypeEnum.webview,
    ProviderTypeEnum.extension,
    ProviderTypeEnum.crossWindow,
    ProviderTypeEnum.walletConnect
  ];

  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler,
    allowedProviders
  });

  const onButtonClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      unlockPanelManager.openUnlockPanel();
    }
  };

  if (mutability === ContractEndpointMutabilityEnum.readonly) {
    return <>{children}</>;
  }

  return (
    <>
      {Boolean(address && isLoggedIn) ? (
        <>{children}</>
      ) : (
        <div className={classNames(styles?.loginButtonWrapper)}>
          <button
            type='button'
            onClick={onButtonClick}
            data-testid={dataTestId ?? ''}
            className={classNames(
              className,
              globalStyles?.button,
              globalStyles?.buttonPrimary,
              customClassNames?.buttonClassName,
              customClassNames?.buttonPrimaryClassName,
              styles?.buttonLogin
            )}
          >
            <FontAwesomeIcon icon={connectIcon} />
            Connect Your Wallet
          </button>
          {buttonDescription && (
            <div
              className={classNames(
                styles?.loginButtonWrapperText,
                globalStyles?.formWarning
              )}
            >
              <div className={classNames(globalStyles?.formWarningText)}>
                {buttonDescription}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const LoginButtonWrapper = withStyles(LoginButtonWrapperComponent, {
  ssrStyles: () => import('components/LoginButton/styles.module.scss'),
  clientStyles: () =>
    require('components/LoginButton/styles.module.scss').default
});
