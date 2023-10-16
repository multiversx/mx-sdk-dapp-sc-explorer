import React, { useCallback } from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetAccount, useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useDispatch } from 'context';
import {
  ActionTypeEnum,
  LoginButtonWrapperUIType,
  ContractEndpointMutabilityEnum
} from 'types';
import styles from './styles.module.scss';

export const LoginButtonWrapper = (props: LoginButtonWrapperUIType) => {
  const { mutability, children, className, customInterface } = props;
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const dispatch = useDispatch();

  const { connectIcon = faBolt } = customInterface?.icons ?? {};

  const onOpenModalClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setLoginModalOpen,
      loginModalOpen: true
    });
  }, []);

  if (mutability !== ContractEndpointMutabilityEnum.mutable) {
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
            onClick={onOpenModalClick}
            className={classNames(
              className,
              globalStyles?.button,
              globalStyles?.buttonPrimary,
              customInterface?.customClassNames?.buttonClassName,
              customInterface?.customClassNames?.buttonPrimaryClassName,
              styles?.buttonLogin
            )}
          >
            <FontAwesomeIcon icon={connectIcon} />
            Connect Your Wallet
          </button>
          <div className={classNames(styles?.loginButtonWrapperText)}>
            to interact with this endpoint.
          </div>
        </div>
      )}
    </>
  );
};
