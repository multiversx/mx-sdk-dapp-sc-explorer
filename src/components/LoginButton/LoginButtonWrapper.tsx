import React from 'react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
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
  const {
    mutability,
    children,
    buttonDescription,
    className,
    'data-testid': dataTestId
  } = props;
  const { accountInfo, customClassNames, icons } = useSCExplorerContext();
  const { isLoggedIn, address, onLoginClick } = accountInfo;
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
