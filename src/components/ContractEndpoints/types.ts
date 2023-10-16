import {
  EndpointDefinition,
  EndpointParameterDefinition
} from '@multiversx/sdk-core/out';
import { FormikProps } from 'formik';
import {
  UserInterfaceType,
  ContractEndpointMutabilityEnum,
  QueryContractResponse
} from 'types';

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

export interface FormikAbiType {
  [key: string]: FormikAbiType | FormikAbiType[] | string[] | string;
}

export interface EndpointFormUIType extends EndpointInteractionUIType {
  onSubmit: (values: any[]) => Promise<void>;
  isLoading?: boolean;
  generalError?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export interface RecursiveContainerUIType extends UserInterfaceType {
  config: FormikAbiType;
  prefix: string;
  formik?: FormikProps<FormikAbiType>;
}

export interface EndpointInteractionUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
  formik?: FormikProps<FormikAbiType>;
  result?: QueryContractResponse;
  mutability?: string | ContractEndpointMutabilityEnum;
}

export interface EndpointInputListUIType extends UserInterfaceType {
  formik?: FormikProps<FormikAbiType>;
  input?: EndpointParameterDefinition[];
}

export interface EndpointOutputUIType extends UserInterfaceType {
  output?: EndpointParameterDefinition[];
  result?: QueryContractResponse;
}

export interface InputUIType extends UserInterfaceType {
  name: string;
  formik?: FormikProps<FormikAbiType>;
  defaultValue?: string;
  children?: React.ReactNode;
}
