import request from 'utils/request';
import {
  ENDPOINT_CHECK_ORDER,
  ENDPOINT_ORDER_ONLINE,
  ENDPOINT_PAYMENT_METHOD,
  ENDPOINT_MOMO,
  ENDPOINT_STORE,
  ENDPOINT_SHIPPING_PACKAGE,
  ENDPOINT_GET_TOTAL_ORDER,
  ENDPOINT_MOMO_MERCHANT,
} from 'variables/api-endpoints';

export const getTotalOrderByUser = () => request.get(ENDPOINT_GET_TOTAL_ORDER);
export const checkOrder = (params?: any) => request.post(ENDPOINT_CHECK_ORDER, params);
export const orderOnline = (params?: any) => request.post(ENDPOINT_ORDER_ONLINE, params);
export const getOrderOnline = (type: string) =>
  request.get(`${ENDPOINT_ORDER_ONLINE}?salesorder_source=${type}`);
export const getOrderOnlineDetail = (id: string) => request.get(`${ENDPOINT_ORDER_ONLINE}/${id}`);
export const getPaymentMethods = () => request.get(ENDPOINT_PAYMENT_METHOD);
export const getStores = () => request.get(ENDPOINT_STORE);
export const getMomoMerchant = () => request.get(ENDPOINT_MOMO_MERCHANT);
export const payMomo = (data: any) => request.post(ENDPOINT_MOMO, data);
export const shippingPackage = (data: any) => request.post(ENDPOINT_SHIPPING_PACKAGE, data);
