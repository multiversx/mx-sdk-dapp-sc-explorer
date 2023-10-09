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

export interface EndpointInputValuesType {
  [k: string]: string | number | string[] | number[];
}

export interface ContractEndpointsUIType extends UserInterfaceType {
  mutability?: ContractEndpointMutabilityEnum;
}

export interface BaseEndpointUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
}

export interface ContractEndpointUIType extends BaseEndpointUIType {
  title?: string;
  isOpen?: boolean;
}

export interface EndpointInteractionUIType extends EndpointInputBaseType {
  endpoint: EndpointDefinition;
  values?: EndpointInputValuesType;
  result?: QueryContractResponse;
}

export interface EndpointFormUIType extends EndpointInteractionUIType {
  onSubmit: (values: EndpointInputValuesType) => Promise<void>;
  isLoading?: boolean;
  generalError?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export interface EndpointOutputUIType extends UserInterfaceType {
  output?: EndpointParameterDefinition[];
  result?: QueryContractResponse;
}

export interface EndpointInputListUIType extends EndpointInputBaseType {
  input?: EndpointParameterDefinition[];
  values?: EndpointInputValuesType;
}

export interface EndpointInputUIType extends EndpointInputBaseType {
  definition: EndpointParameterDefinition;
  value: string | number | string[] | number[] | undefined;
}

export interface EndpointInputBaseType extends UserInterfaceType {
  handleChange?: FormikHandlers['handleChange'];
  handleBlur?: FormikHandlers['handleBlur'];
  errors?: FormikErrors<EndpointInputValuesType>;
  touched?: FormikTouched<EndpointInputValuesType>;
  index?: number;
  name?: string;
  mutability?: string | ContractEndpointMutabilityEnum;
}

export interface InputUIType extends EndpointInputUIType {
  handleChange: FormikHandlers['handleChange'];
  handleBlur: FormikHandlers['handleBlur'];
  errors: FormikErrors<EndpointInputValuesType>;
  touched: FormikTouched<EndpointInputValuesType>;
  name: string;
  children?: React.ReactNode;
}
