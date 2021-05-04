import axios from 'axios';
import { getUserToken } from 'utils/storage-helper';

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}

const instance = axios.create({
  timeout: 20000,
});

instance.interceptors.request.use(async config => {
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-APP-KEY'] = 'app_d2ce6e48-de9c-40f6-81bc-a8b28e7a7acc';
  config.headers['X-USER-TOKEN'] = await getUserToken();
  return config;
});
instance.interceptors.response.use(
  response => {
    return response;
  },
  function (error) {
    console.log('error', error);
    // console.log(JSON.stringify(error));
    return Promise.reject(error?.response?.data || error);
  }
);

export default instance;
