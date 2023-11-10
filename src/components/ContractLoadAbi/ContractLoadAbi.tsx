import React, { memo, useState } from 'react';
import {
  faCopy,
  faCircleCheck,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AbiRegistry } from '@multiversx/sdk-core/out';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { mixed, object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { Card, Code, PanelHeader } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useSCExplorerContext, useSmartContractDispatch } from 'contexts';
import { useGetDeployedContractDetails } from 'hooks';
import { SmartContractDispatchTypeEnum } from 'types';
import { DropzoneAbi } from './components';
import styles from './styles.module.scss';
import { FormikLoadAbiType, ContractLoadAbiFormikFieldsEnum } from './types';

export const ContractLoadAbiComponent = () => {
  const { support, customClassNames, smartContract, icons } =
    useSCExplorerContext();
  const { canLoadAbi } = support;
  const { abiRegistry, rawAbi, deployedContractDetails } = smartContract;
  const { copyIcon = faCopy, loadIcon = faCircleNotch } = icons ?? {};
  const smartContractDispatch = useSmartContractDispatch();
  const getDeployedContractDetails = useGetDeployedContractDetails();
  const [isContractAddressCheckLoading, setIsContractAddressCheckLoading] =
    useState(false);

  const initialValues: FormikLoadAbiType = {
    [ContractLoadAbiFormikFieldsEnum.contractAddress]: '',
    [ContractLoadAbiFormikFieldsEnum.abiFileContent]: undefined
  };

  const isObject = (obj: Record<string, string>) =>
    typeof obj === 'object' && obj !== null;

  const validationSchema = object({
    [ContractLoadAbiFormikFieldsEnum.contractAddress]: string().test(
      'validAddress',
      'Invalid Address',
      (value) => {
        if (value === undefined) {
          return true;
        }
        return addressIsValid(value);
      }
    ),
    [ContractLoadAbiFormikFieldsEnum.abiFileContent]: mixed()
      .required('Required')
      .test('isValidObject', 'Required', (value) => {
        return isObject(value) && Object.keys(value).length > 0;
      })
      .test('isValidFile', 'Invalid file type', (value: any) => {
        const type: string = value?.type;

        if (!type) {
          return true;
        }

        return type === 'application/json';
      })
  });

  const onSubmit = async (values: typeof initialValues) => {
    if (values[ContractLoadAbiFormikFieldsEnum.contractAddress]) {
      smartContractDispatch({
        type: SmartContractDispatchTypeEnum.setContractAddress,
        contractAddress: values[ContractLoadAbiFormikFieldsEnum.contractAddress]
      });

      setIsContractAddressCheckLoading(true);
      await getDeployedContractDetails({
        address: values[ContractLoadAbiFormikFieldsEnum.contractAddress]
      });
      setIsContractAddressCheckLoading(false);
    }
    if (values[ContractLoadAbiFormikFieldsEnum.abiFileContent]) {
      const abi = values[ContractLoadAbiFormikFieldsEnum.abiFileContent];
      if (!abi.name) {
        abi.name = INTERFACE_NAME_PLACEHOLDER;
      }
      smartContractDispatch({
        type: SmartContractDispatchTypeEnum.setRawAbi,
        rawAbi: abi
      });
      try {
        const abiRegistry = AbiRegistry.create(abi);
        smartContractDispatch({
          type: SmartContractDispatchTypeEnum.setAbiRegistry,
          abiRegistry
        });
      } catch (error) {
        console.error('Unable to parse Loaded ABI: ', error);
      }
    }
  };

  const code = rawAbi ? JSON.stringify(rawAbi, null, 2) : '';

  if (!canLoadAbi) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles?.contractLoadAbi,
        globalStyles?.panelWrapper,
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader>Load ABI</PanelHeader>
      <Card>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(formik) => {
            const { errors, handleChange, handleBlur } = formik;
            const inputError = getIn(
              errors,
              ContractLoadAbiFormikFieldsEnum.contractAddress
            );

            return (
              <Form
                onSubmit={formik.handleSubmit}
                className={classNames(styles?.contractLoadAbiForm)}
              >
                <DropzoneAbi {...formik} />
                <div className={classNames(styles?.contractLoadAbiFormFields)}>
                  <label
                    htmlFor={ContractLoadAbiFormikFieldsEnum.contractAddress}
                    className={globalStyles?.label}
                  >
                    Contract Address (Required for Contract Interaction)
                  </label>
                  <div
                    className={classNames(
                      globalStyles?.inputGroup,
                      customClassNames?.inputGroupClassName
                    )}
                  >
                    <Field
                      id={ContractLoadAbiFormikFieldsEnum.contractAddress}
                      name={ContractLoadAbiFormikFieldsEnum.contractAddress}
                      autoComplete='off'
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Contract Address'
                      className={classNames(
                        globalStyles?.input,
                        customClassNames?.inputClassName,
                        { [globalStyles?.inputInvalid]: inputError },
                        {
                          ...(customClassNames?.inputInvalidClassName
                            ? {
                                [customClassNames.inputInvalidClassName]:
                                  inputError
                              }
                            : {})
                        }
                      )}
                    />
                    {(isContractAddressCheckLoading ||
                      deployedContractDetails?.code) && (
                      <div
                        className={classNames(
                          globalStyles?.inputGroupAppend,
                          customClassNames?.inputGroupAppendClassName
                        )}
                      >
                        {isContractAddressCheckLoading ? (
                          <FontAwesomeIcon
                            icon={loadIcon}
                            className='fa-spin fast-spin'
                          />
                        ) : (
                          <>
                            {deployedContractDetails?.code && (
                              <FontAwesomeIcon icon={faCircleCheck} />
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {inputError && typeof inputError === 'string' && (
                      <div
                        className={classNames(
                          globalStyles?.inputInvalidFeedback,
                          customClassNames?.inputInvalidFeedbackClassName
                        )}
                      >
                        {inputError}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type='submit'
                  className={classNames(
                    globalStyles?.button,
                    globalStyles?.buttonPrimary,
                    customClassNames?.buttonClassName,
                    customClassNames?.buttonPrimaryClassName,
                    styles?.contractLoadAbiButton
                  )}
                  {...(!formik.isValid ? { disabled: true } : {})}
                >
                  {Boolean(abiRegistry || deployedContractDetails)
                    ? 'Update Config'
                    : 'Save Config'}
                </button>
                {code && (
                  <div
                    className={classNames(
                      globalStyles?.codeContainer,
                      styles?.contractLoadAbiCodeContainer
                    )}
                  >
                    <h6
                      className={classNames(globalStyles?.cardContainerTitle)}
                    >
                      ABI Preview
                    </h6>
                    <div className={classNames(globalStyles?.codeBlock)}>
                      <div className={classNames(globalStyles?.buttonHolder)}>
                        <CopyButton
                          text={code}
                          className={classNames(globalStyles?.copyButton)}
                          copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
                        />
                      </div>
                      <Code
                        className={classNames(
                          globalStyles?.endpointOutputResultsCode
                        )}
                        code={code}
                        showLineNumbers={true}
                        language='properties'
                      />
                    </div>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};

export const ContractLoadAbi = memo(ContractLoadAbiComponent);
