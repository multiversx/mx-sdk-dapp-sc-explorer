import axios from 'axios';

import { ProviderType } from '../types';

const apiGenericGet: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}/${url}`, { params, timeout });
};

const apiGenericPost: ProviderType = ({
  baseUrl,
  url,
  params,
  timeout,
  request
}) => {
  return axios.post(`${baseUrl}/${url}`, request, {
    params,
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const apiProvider = {
  get: apiGenericGet,
  post: apiGenericPost
};
