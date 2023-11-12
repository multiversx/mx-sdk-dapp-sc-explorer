import {
  EndpointDefinition,
  EndpointParameterDefinition
} from '@multiversx/sdk-core/out';
import { FormikProps } from 'formik';
import { UserInterfaceType } from 'types';

export interface FormikAbiType {
  [key: string]: FormikAbiType | FormikAbiType[] | string[] | string;
}

export interface RecursiveContainerUIType extends UserInterfaceType {
  config: FormikAbiType;
  prefix: string;
  endpoint: EndpointDefinition;
  formik?: FormikProps<FormikAbiType>;
}

export interface InputListUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
  formik?: FormikProps<FormikAbiType>;
  input?: EndpointParameterDefinition[];
}

export interface InputUIType extends UserInterfaceType {
  name: string;
  formik?: FormikProps<FormikAbiType>;
  defaultValue?: string;
  children?: React.ReactNode;
}
