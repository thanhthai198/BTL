import request from 'utils/request';
import { ENDPOINT_CHECK_USER, ENDPOINT_LOGIN } from 'variables/api-endpoints';

export const checkPhone = (data: any) => {
  return request.post(ENDPOINT_CHECK_USER, data);
};

export const login = (data: any) => request.post(ENDPOINT_LOGIN, data);
