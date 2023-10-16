import React, { ReactNode, useState, useCallback } from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { fallbackNetworkConfigurations } from '@multiversx/sdk-dapp/constants/network';
import { useGetAccountProvider } from '@multiversx/sdk-dapp/hooks';
import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton
} from '@multiversx/sdk-dapp/UI';
import { Modal } from 'react-bootstrap';

import { useDispatch, useScContext } from 'context';
import { ActionTypeEnum } from 'types';
import styles from './styles.module.scss';
import { LoginModalUIType } from './types';

enum LoginContainersTypesEnum {
  walletConnect = 'walletConnect',
  ledger = 'ledger',
  none = 'none'
}

export const LoginModal = (props: LoginModalUIType) => {
  const dispatch = useDispatch();
  const { loginModalOpen } = useScContext();
  const { providerType } = useGetAccountProvider();
  const [openedLoginContainerType, setOpenedContainerType] = useState(
    LoginContainersTypesEnum.none
  );

  const buttons = [
    {
      name: 'MultiversX DeFi Wallet',
      component: ExtensionLoginButton
    },
    {
      name: 'xPortal',
      component: WalletConnectLoginButton,
      id: LoginContainersTypesEnum.walletConnect,
      isWalletConnectV2: true,
      onModalOpens: () =>
        setOpenedContainerType(LoginContainersTypesEnum.walletConnect)
    },
    {
      name: 'Ledger',
      id: LoginContainersTypesEnum.ledger,
      component: LedgerLoginButton,
      onModalOpens: () =>
        setOpenedContainerType(LoginContainersTypesEnum.ledger)
    },
    {
      name: 'MultiversX Web Wallet',
      component: WebWalletLoginButton
    }
  ];

  function renderLoginButton(
    content: ReactNode,
    containerType = LoginContainersTypesEnum.none
  ) {
    const shouldRender =
      openedLoginContainerType === LoginContainersTypesEnum.none ||
      containerType === openedLoginContainerType;
    return shouldRender ? content : null;
  }

  const onClose = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setLoginModalOpen,
      loginModalOpen: false
    });
    setOpenedContainerType(LoginContainersTypesEnum.none);
  }, []);

  const onLoginRedirect = () => {
    onClose();
  };

  const titles = {
    [LoginContainersTypesEnum.none]: 'Select Provider',
    [LoginContainersTypesEnum.ledger]: 'Login with Ledger',
    [LoginContainersTypesEnum.walletConnect]: 'Login with xPortal'
  };

  return (
    <Modal
      show={loginModalOpen}
      onHide={onClose}
      keyboard={false}
      backdrop='static'
      animation={false}
      centered={true}
      className={styles.modal}
      dialogClassName={styles.dialog}
    >
      <div className={styles.unlock}>
        <div className={styles.heading}>
          <div className={styles.title}>
            {titles[openedLoginContainerType] ||
              titles[LoginContainersTypesEnum.none]}
          </div>

          <div className={styles.close} onClick={onClose}>
            x
          </div>
        </div>

        <div className={styles.buttons}>
          {buttons.map((button) =>
            renderLoginButton(
              <button.component
                key={button.name}
                callbackRoute={
                  providerType === LoginMethodsEnum.wallet ? '/' : undefined
                }
                className={styles.button}
                wrapContentInsideModal={false}
                hideButtonWhenModalOpens={true}
                //nativeAuth={{ apiAddress, expirySeconds: 7200 }}
                onLoginRedirect={onLoginRedirect}
                {...button}
              >
                <span className={styles.name}>{button.name}</span>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrow} />
              </button.component>,
              button.id
            )
          )}
        </div>
      </div>
    </Modal>
  );
};
