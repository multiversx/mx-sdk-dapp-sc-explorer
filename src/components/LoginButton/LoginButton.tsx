import React, { useCallback } from 'react';
import { faCopy, faBolt, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import { isWindowAvailable } from '@multiversx/sdk-dapp/utils/isWindowAvailable';
import { logout } from '@multiversx/sdk-dapp/utils/logout';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useSCExplorerContext, useDispatch } from 'contexts';
import { ActionTypeEnum, LoginButtonUIType } from 'types';
import styles from './styles.module.scss';

export const LoginButton = (props: LoginButtonUIType) => {
  const { customClassNames, icons, accountInfo } = useSCExplorerContext();
  const { isLoggedIn, address } = accountInfo;
  const { className } = props;
  const dispatch = useDispatch();

  const {
    copyIcon = faCopy,
    connectIcon = faBolt,
    disconnectIcon = faPowerOff
  } = icons ?? {};

  const onOpenModalClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setLoginModalOpen,
      loginModalOpen: true
    });
  }, []);

  const onDisconnectClick = () => {
    logout(isWindowAvailable() ? window.location.href : '/');
  };

  return (
    <>
      {Boolean(address && isLoggedIn) ? (
        <div className={classNames(styles?.connectedWrapper)}>
          <Trim text={address} />
          <CopyButton
            text={address}
            copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
          />
          <button
            type='button'
            className={classNames(globalStyles?.button, styles?.buttonLogout)}
            onClick={onDisconnectClick}
          >
            <FontAwesomeIcon icon={disconnectIcon} />
          </button>
        </div>
      ) : (
        <div className={classNames(styles?.disconnectedWrapper)}>
          <div className={classNames(styles?.disconnectedWrapperText)}>
            Connect your wallet to interact with this smart contract
          </div>
          <button
            type='button'
            onClick={onOpenModalClick}
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
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};
