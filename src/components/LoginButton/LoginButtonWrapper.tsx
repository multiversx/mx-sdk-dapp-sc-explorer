import React from 'react';
import {
  faBolt,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useSCExplorerContext, useUserActionDispatch } from 'contexts';
import {
  UserActionDispatchTypeEnum,
  LoginButtonWrapperUIType,
  ContractEndpointMutabilityEnum
} from 'types';
import styles from './styles.module.scss';

export const LoginButtonWrapper = (props: LoginButtonWrapperUIType) => {
  const { mutability, children, className } = props;
  const { accountInfo, smartContract, customClassNames, icons } =
    useSCExplorerContext();
  const { isLoggedIn, address, onLoginClick } = accountInfo;
  const { deployedContractDetails } = smartContract;
  const userActionDispatch = useUserActionDispatch();

  const { connectIcon = faBolt } = icons ?? {};

  const onButtonClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      userActionDispatch({
        type: UserActionDispatchTypeEnum.setLoginModalState,
        loginModalState: { loginModalOpen: true }
      });
    }
  };

  if (!deployedContractDetails?.code) {
    return (
      <div className={classNames(styles?.loginButtonWrapper)}>
        <div className={classNames(styles?.loginButtonWrapperText)}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className={classNames(styles?.loginButtonWarningIcon)}
          />
          Contract Address is required in order to interact with the Endpoints
        </div>
      </div>
    );
  }

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
            onClick={onButtonClick}
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
