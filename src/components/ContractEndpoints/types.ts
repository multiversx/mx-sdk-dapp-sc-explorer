import {
  EndpointDefinition,
  EndpointParameterDefinition
} from '@multiversx/sdk-core/out';
import { FormikHandlers, FormikErrors, FormikTouched } from 'formik';

import {
  UserInterfaceType,
  ContractEndpointMutabilityEnum,
  QueryContractResponse
} from 'types';

export interface ContractEndpointsUIType extends UserInterfaceType {
  mutability?: ContractEndpointMutabilityEnum;
}

export interface ContractEndpointUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
  title?: string;
  isOpen?: boolean;
}

export interface EndpointOutputUIType extends UserInterfaceType {
  output?: EndpointParameterDefinition[];
  result?: QueryContractResponse;
}

export interface EndpointInputValuesType {
  [k: string]: string | number | string[] | number[];
}

export interface EndpointInputBaseType extends UserInterfaceType {
  handleChange: FormikHandlers['handleChange'];
  handleBlur: FormikHandlers['handleBlur'];
  errors: FormikErrors<EndpointInputValuesType>;
  touched: FormikTouched<EndpointInputValuesType>;
  key?: number;
  name?: string;
  mutability?: string | ContractEndpointMutabilityEnum;
}

export interface EndpointInputListUIType extends EndpointInputBaseType {
  input?: EndpointParameterDefinition[];
  values?: EndpointInputValuesType;
}

export interface EndpointInputUIType extends EndpointInputBaseType {
  definition: EndpointParameterDefinition;
  value: string | number | string[] | number[] | undefined;
}

export interface InputUIType extends EndpointInputUIType {
  name: string;
  children?: React.ReactNode;
}
