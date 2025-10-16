import React from 'react';
import {
  faPlay,
  faCircleNotch,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { lazy, mixed, object } from 'yup';

import { LoginButtonWrapper } from 'components';
import { useSCExplorerContext } from 'contexts';
import { getInitalFormConfig, getNativeArgumentsFromValues } from 'helpers';
import { withStyles } from 'hocs/withStyles';
import { MvxCopyButton, MvxTrim } from 'lib';
import { NativeSerializer } from 'lib/sdkCore';
import { EndpointFormUIType, FormikAbiType } from 'types';

import { EndpointInteraction } from './EndpointInteraction';

export const EndpointFormComponent = (props: EndpointFormUIType) => {
  const { smartContract, accountInfo, customClassNames, icons } =
    useSCExplorerContext();
  const {
    endpoint,
    onSubmit,
    buttonText,
    result,
    isLoading,
    generalError,
    resetForm = true,
    className,
    globalStyles,
    styles
  } = props;
  const { address: callerAddress, isLoggedIn } = accountInfo;
  const { deployedContractDetails } = smartContract;
  const { ownerAddress } = deployedContractDetails || {};
  const { input, modifiers } = endpoint;
  const { mutability } = modifiers;
  const { playIcon = faPlay, loadIcon = faCircleNotch } = icons ?? {};

  const isOwnerConnected = Boolean(
    callerAddress && ownerAddress && callerAddress === ownerAddress
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
      onSubmit={async (values, { resetForm: formikResetForm }) => {
        const nativeArgs = getNativeArgumentsFromValues(values);
        await onSubmit(nativeArgs);
        if (resetForm) {
          formikResetForm();
        }
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => {
        const { errors } = formik;
        const hasOnlyGeneralValidationError =
          errors?.general && Object?.keys(errors).length === 1;
        const isButtonDisabled =
          isLoading ||
          !formik.isValid ||
          (modifiers?.isOnlyOwner() && isLoggedIn && !isOwnerConnected);

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
              <div
                className={classNames(
                  styles?.endpointGeneralError,
                  globalStyles?.generalError
                )}
              >
                {hasOnlyGeneralValidationError &&
                  typeof errors?.general === 'string' && (
                    <p>{errors.general}</p>
                  )}
                {generalError && <p>{generalError}</p>}
              </div>
            )}
            <div
              className={classNames(
                styles?.endpointActionWrapper,
                globalStyles?.formActionWrapper
              )}
            >
              {deployedContractDetails?.code ? (
                <LoginButtonWrapper
                  className={classNames(globalStyles?.buttonAction)}
                  mutability={mutability}
                  buttonDescription='to interact with this endpoint.'
                >
                  <button
                    className={classNames(
                      globalStyles?.button,
                      globalStyles?.buttonPrimary,
                      globalStyles?.buttonAction,
                      customClassNames?.buttonClassName,
                      customClassNames?.buttonPrimaryClassName
                    )}
                    type='submit'
                    {...(isButtonDisabled ? { disabled: true } : {})}
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
              ) : (
                <div className={classNames(globalStyles?.formWarning)}>
                  <div className={classNames(globalStyles?.formWarningText)}>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className={classNames(globalStyles?.formWarningIcon)}
                    />
                    Contract Address is required in order to interact with the
                    Endpoints
                  </div>
                </div>
              )}
              {isLoggedIn &&
                modifiers?.isOnlyOwner() &&
                !isOwnerConnected &&
                ownerAddress && (
                  <div className={classNames(globalStyles?.formWarning)}>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className={classNames(globalStyles?.formWarningIcon)}
                    />
                    <span className={classNames(globalStyles?.formWarningText)}>
                      You must connect with
                    </span>
                    <div
                      className={classNames(globalStyles?.formWarningAddress)}
                    >
                      <MvxTrim text={ownerAddress} />
                      <MvxCopyButton text={ownerAddress} />
                    </div>
                    <span className={classNames(globalStyles?.formWarningText)}>
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

export const EndpointForm = withStyles(EndpointFormComponent, {
  ssrStyles: () => import('components/Forms/EndpointForm/styles.module.scss'),
  clientStyles: () =>
    require('components/Forms/EndpointForm/styles.module.scss').default
});
