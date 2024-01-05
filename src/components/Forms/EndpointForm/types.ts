import {
  EndpointDefinition,
  EndpointParameterDefinition
} from '@multiversx/sdk-core/out';
import { FormikProps } from 'formik';
import {
  UserInterfaceType,
  ContractEndpointMutabilityEnum,
  QueryContractResponse,
  FormikAbiType
} from 'types';

export interface EndpointInteractionUIType extends UserInterfaceType {
  endpoint: EndpointDefinition;
  formik?: FormikProps<FormikAbiType>;
  result?: QueryContractResponse;
  mutability?: string | ContractEndpointMutabilityEnum;
  resetForm?: boolean;
}

export interface EndpointFormUIType extends EndpointInteractionUIType {
  onSubmit: (values: any[]) => Promise<void>;
  isLoading?: boolean;
  generalError?: string;
  buttonText?: string;
}

export interface EndpointOutputUIType extends UserInterfaceType {
  output?: EndpointParameterDefinition[];
  result?: QueryContractResponse;
}
