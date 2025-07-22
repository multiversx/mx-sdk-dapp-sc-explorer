import React from 'react';

import { DECIMALS } from '@multiversx/sdk-dapp/constants/index';
import { getEgldLabel } from '@multiversx/sdk-dapp/utils/network/getEgldLabel';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import { stringIsFloat } from '@multiversx/sdk-dapp/utils/validation/stringIsFloat';
import BigNumber from 'bignumber.js';
import { Formik } from 'formik';
import { array, object, string } from 'yup';

import {
  SC_GAS_LIMIT,
  SC_DEPLOY_GAS_LIMIT,
  METADATA_OPTIONS
} from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { getSelectOptions } from 'helpers';

import {
  MetadataFieldsInitialValuesType,
  InteractionFormUIType,
  InteractionModalFormikFieldsEnum
} from 'types';

import { InteractionFormContent } from './InteractionFormContent';

export const InteractionForm = (props: InteractionFormUIType) => {
  const {
    onSubmit,
    isUpgrade = false,
    isDeploy = false,
    isMutate = false,
    endpoint,
    tokens
  } = props;
  const { accountInfo } = useSCExplorerContext();

  const { modifiers } = endpoint ?? {};
  const { isLoggedIn, balance: egldBalance } = accountInfo;

  const metadataOptionsInitialValues =
    isDeploy || isUpgrade
      ? Object.fromEntries(
          Object.entries(METADATA_OPTIONS).map(([key, { checked }]) => [
            key,
            checked
          ])
        )
      : {};

  const defaultGasLimit = isMutate ? SC_GAS_LIMIT : SC_DEPLOY_GAS_LIMIT;

  const initialValues = {
    [InteractionModalFormikFieldsEnum.gasLimit]: defaultGasLimit,
    [InteractionModalFormikFieldsEnum.tokens]:
      isMutate && modifiers?.isPayable()
        ? [
            {
              tokenAmount: '',
              tokenIdentifier: '',
              tokenDecimals: DECIMALS,
              tokenType: '',
              tokenNonce: 0
            }
          ]
        : [],
    ...(metadataOptionsInitialValues as unknown as MetadataFieldsInitialValuesType)
  };

  const tokenList = getSelectOptions({
    tokens,
    includeEgld: modifiers?.isPayableInEGLD(),
    egldBalance
  });
  const egldLabel = getEgldLabel();

  const validationSchema = object({
    gasLimit: string()
      .required('Required')
      .test('isValidNumber', 'Invalid Number', (value) =>
        Boolean(value && stringIsFloat(value))
      ),
    tokens: array().of(
      object().shape({
        tokenAmount: string()
          .required('Amount Required')
          .test('isValidNumber', 'Invalid Number', (value) =>
            Boolean(value && stringIsFloat(value))
          )
          .test(
            'hasFunds',
            'Insufficient funds',
            function checkHasFunds(value) {
              if (
                value &&
                tokenList.length > 0 &&
                this?.parent?.tokenIdentifier
              ) {
                const selectedToken = tokenList.find(
                  (option) =>
                    option?.token?.identifier === this?.parent?.tokenIdentifier
                );
                if (selectedToken) {
                  const parsedAmount = parseAmount(
                    value.toString(),
                    selectedToken.token.decimals
                  );
                  const bnAmount = new BigNumber(parsedAmount);
                  const bnBalance = new BigNumber(
                    selectedToken.token.balance ?? '0'
                  );
                  return bnBalance.isGreaterThanOrEqualTo(bnAmount);
                }
              }

              return true;
            }
          )
          .test(
            'hasValidValue',
            'ESDToken amount cannot be 0',
            function checkESDTTokenAmount(value) {
              if (
                value &&
                this?.parent?.tokenIdentifier &&
                this.parent.tokenIdentifier !== egldLabel
              ) {
                return new BigNumber(value.toString()).isGreaterThan(0);
              }

              return true;
            }
          ),

        tokenIdentifier: string()
          .required('Token Required')
          .test('tokenIdentifier', 'Invalid Token', (value) => {
            if (tokenList.length > 0) {
              return tokenList.some((token) => token.value === value);
            }
            return true;
          })
      })
    )
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { resetForm }) => {
        await onSubmit(values);
        resetForm();
      }}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      {(formik) => <InteractionFormContent {...props} formik={formik} />}
    </Formik>
  );
};
