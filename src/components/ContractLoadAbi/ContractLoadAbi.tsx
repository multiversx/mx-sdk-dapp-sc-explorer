import React, { memo } from 'react';
import {
  faCopy,
  faCircleCheck,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account/addressIsValid';
import classNames from 'classnames';
import { Formik, Form, Field, getIn } from 'formik';
import { mixed, object, string } from 'yup';

import globalStyles from 'assets/styles/globals.module.scss';
import { Card, Code, PanelHeader } from 'components';
import { DropzoneAbi } from 'components/Dropzone/DropzoneAbi';
import { useSCExplorerContext } from 'contexts';
import { useUpdateDeployedContractDetails } from 'hooks';
import {
  FormikLoadAbiType,
  ContractLoadAbiFormikFieldsEnum,
  DataTestIdsEnum
} from 'types';
import styles from './styles.module.scss';

export const ContractLoadAbiComponent = () => {
  const { support, customClassNames, smartContract, icons } =
    useSCExplorerContext();
  const { canLoadAbi } = support;
  const { rawAbi, deployedContractDetails, contractAddress } = smartContract;
  const { copyIcon = faCopy, loadIcon = faCircleNotch } = icons ?? {};

  const { updateDeployedContractDetails, isContractAddressCheckLoading } =
    useUpdateDeployedContractDetails();

  const initialValues: FormikLoadAbiType = {
    [ContractLoadAbiFormikFieldsEnum.contractAddress]: contractAddress ?? '',
    [ContractLoadAbiFormikFieldsEnum.abiFileContent]: rawAbi
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
      .test('isValidObject', 'Required', (value) => {
        if (value === undefined) {
          return true;
        }

        return value && isObject(value) && Object.keys(value).length > 0;
      })
      .test('isValidFile', 'Invalid file type', (value: any) => {
        const type: string = value?.type;

        if (!type) {
          return true;
        }

        return type === 'application/json';
      })
  });

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
          onSubmit={() => {}}
          validateOnChange
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(formik) => {
            const { errors, handleChange, handleBlur } = formik;
            const inputError = getIn(
              errors,
              ContractLoadAbiFormikFieldsEnum.contractAddress
            );

            const formattedContent = rawAbi
              ? JSON.stringify(rawAbi, null, 2)
              : '';

            return (
              <Form
                onSubmit={formik.handleSubmit}
                className={classNames(styles?.contractLoadAbiForm)}
              >
                <div className={classNames(styles?.contractLoadAbiFormFields)}>
                  <label
                    htmlFor={ContractLoadAbiFormikFieldsEnum.contractAddress}
                    className={globalStyles?.label}
                  >
                    Contract Address (Required for Contract Interaction and
                    Upgrade)
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
                      onChange={async (e: React.FocusEvent<any, Element>) => {
                        handleChange(e);
                        if (e?.target?.value !== contractAddress) {
                          await updateDeployedContractDetails({
                            address: e?.target?.value
                          });
                        }
                      }}
                      onBlur={handleBlur}
                      placeholder='Contract Address'
                      data-testid={DataTestIdsEnum.abiContractAddress}
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
                          globalStyles?.inputGroupAppendIcon,
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
                <DropzoneAbi
                  {...formik}
                  fieldName={ContractLoadAbiFormikFieldsEnum.abiFileContent}
                />

                {formattedContent && (
                  <div
                    className={classNames(
                      globalStyles?.codeContainer,
                      styles?.contractLoadAbiFormCodeContainer
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
                          text={formattedContent}
                          className={classNames(globalStyles?.copyButton)}
                          copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
                        />
                      </div>
                      <Code
                        className={classNames(
                          globalStyles?.endpointOutputResultsCode
                        )}
                        code={formattedContent}
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
