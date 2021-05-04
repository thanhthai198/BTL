import request from 'utils/request';
import {
  ENDPOINT_DISTRICT,
  ENDPOINT_GET_ADDRESS,
  ENDPOINT_PROVINCE,
  ENDPOINT_WARD,
} from 'variables/api-endpoints';

export const getProvince = () => request.get(ENDPOINT_PROVINCE);
export const getDistrict = (id: number) => request.get(`${ENDPOINT_DISTRICT}/${id}`);
export const getWard = (id: number) => request.get(`${ENDPOINT_WARD}/${id}`);
export const getAllAddress = () => request.get(ENDPOINT_GET_ADDRESS);
export const addAddress = (data: any) => request.post(ENDPOINT_GET_ADDRESS, data);
