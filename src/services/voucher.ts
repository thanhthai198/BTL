import request from 'utils/request';
import { ENDPOINT_GET_VOUCHER } from 'variables/api-endpoints';

export const getAllVoucher = () => request.get(ENDPOINT_GET_VOUCHER);
