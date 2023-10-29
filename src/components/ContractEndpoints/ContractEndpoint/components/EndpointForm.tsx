import React from 'react';
import {
  faCopy,
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NativeSerializer } from '@multiversx/sdk-core/out';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { lazy, mixed, object } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { LoginButtonWrapper } from 'components';
import { useSCExplorerContext } from 'contexts';
import { EndpointFormUIType, FormikAbiType } from 'types';
import { EndpointInteraction } from './EndpointInteraction';
import { getInitalFormConfig, getNativeArgumentsFromValues } from '../helpers';
import styles from '../styles.module.scss';

export const EndpointForm = (props: EndpointFormUIType) => {
  const { smartContract, accountInfo, customClassNames, icons } =
    useSCExplorerContext();
  const {
    endpoint,
    onSubmit,
    buttonText,
    result,
    isLoading,
    generalError,
    className
  } = props;
  const { address: callerAddress, isLoggedIn } = accountInfo;
  const { ownerAddress } = smartContract;
  const { input, modifiers } = endpoint;
  const { mutability } = modifiers;
  const {
    playIcon = faPlay,
    loadIcon = faCircleNotch,
    copyIcon = faCopy
  } = icons ?? {};

  const isOwnerConnected = Boolean(
    isLoggedIn &&
      callerAddress &&
      ownerAddress &&
      callerAddress === ownerAddress
  );

  const initialValues: FormikAbiType = Object.fromEntries(
    input.map((input) => {
      return [input?.name, getInitalFormConfig({ type: input.type })];
    })
  );

  const validationSchema = lazy((innerObj) => {
    if (innerObj !== undefined) {
      return object().test('validArguments', (value, { createError }) => {
        try {
          const existingValues = getNativeArgumentsFromValues(value);
          NativeSerializer.nativeToTypedValues(existingValues || [], endpoint);
        } catch (error) {
          return createError({
            path: 'general',
            message: String(error)
          });
        }

        return true;
      });
    }
    return mixed().notRequired();
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const nativeArgs = getNativeArgumentsFromValues(values);
        await onSubmit(nativeArgs);
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
    >
      {(formik) => {
        const { errors } = formik;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;

        return (
          <Form
            onSubmit={formik.handleSubmit}
            className={classNames(className)}
          >
            <EndpointInteraction
              endpoint={endpoint}
              formik={formik}
              result={result}
            />
            {(hasOnlyGeneralValidationError || generalError) && (
              <div className={classNames(styles?.endpointGeneralError)}>
                {hasOnlyGeneralValidationError && <p>{errors?.general}</p>}
                {generalError && <p>{generalError}</p>}
              </div>
            )}
            <div className={classNames(styles?.endpointActionWrapper)}>
              <LoginButtonWrapper
                className={classNames(styles?.buttonEndpointAction)}
                mutability={mutability}
              >
                <button
                  className={classNames(
                    globalStyles?.button,
                    globalStyles?.buttonPrimary,
                    customClassNames?.buttonClassName,
                    customClassNames?.buttonPrimaryClassName,
                    styles?.buttonEndpointAction
                  )}
                  type='submit'
                  {...(isLoading ||
                  !formik.isValid ||
                  (modifiers?.isOnlyOwner() && !isOwnerConnected)
                    ? { disabled: true }
                    : {})}
                >
                  {buttonText}
                  {isLoading ? (
                    <FontAwesomeIcon
                      icon={loadIcon}
                      className='fa-spin fast-spin'
                    />
                  ) : (
                    <FontAwesomeIcon icon={playIcon} />
                  )}
                </button>
              </LoginButtonWrapper>
              {modifiers?.isOnlyOwner() &&
                !isOwnerConnected &&
                ownerAddress && (
                  <div
                    className={classNames(styles?.endpointOwnerNotification)}
                  >
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className={classNames(
                        styles?.endpointOwnerNotificationIcon
                      )}
                    />
                    <span
                      className={classNames(
                        styles?.endpointOwnerNotificationText
                      )}
                    >
                      You must connect with
                    </span>
                    <div
                      className={classNames(
                        styles?.endpointOwnerNotificationAddress
                      )}
                    >
                      <Trim text={ownerAddress} />
                      <CopyButton
                        text={ownerAddress}
                        copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
                      />
                    </div>
                    <span
                      className={classNames(
                        styles?.endpointOwnerNotificationText
                      )}
                    >
                      to call this endpoint.
                    </span>
                  </div>
                )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
