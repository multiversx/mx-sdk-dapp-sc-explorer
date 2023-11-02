import React, { useCallback } from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useSCExplorerContext, useDispatch } from 'contexts';
import {
  ActionTypeEnum,
  LoginButtonWrapperUIType,
  ContractEndpointMutabilityEnum
} from 'types';
import styles from './styles.module.scss';

export const LoginButtonWrapper = (props: LoginButtonWrapperUIType) => {
  const { mutability, children, className } = props;
  const { accountInfo, customClassNames, icons } = useSCExplorerContext();
  const { isLoggedIn, address } = accountInfo;
  const dispatch = useDispatch();

  const { connectIcon = faBolt } = icons ?? {};

  const onOpenModalClick = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.setLoginModalState,
      loginModalState: { loginModalOpen: true }
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
              customClassNames?.buttonClassName,
              customClassNames?.buttonPrimaryClassName,
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
