import axios from 'axios';

import { ProviderType } from '../types';

const proxyGenericGet: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}/${url}`, { params, timeout });
};

const proxyGenericPost: ProviderType = ({
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
export const proxyProvider = {
  get: proxyGenericGet,
  post: proxyGenericPost
};
