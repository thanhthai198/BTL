import request from 'utils/request';
import { ENDPOINT_UPLOAD_IMAGE } from 'variables/api-endpoints';

export const uploadImage = (data: any) => request.post(ENDPOINT_UPLOAD_IMAGE, data);
