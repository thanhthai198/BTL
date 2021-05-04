import request from 'utils/request';
import {
  ENDPOINT_CHECK_USER,
  ENDPOINT_CREATE_USER,
  ENDPOINT_GENERATE_OTP,
  ENDPOINT_VERIFY_SMS_OTP,
  ENDPOINT_UPDATE_PASSWORD,
  ENDPOINT_UPDATE_USER,
  ENDPOINT_FORGOT_PASSWORD,
  ENDPOINT_USER_INFO,
  ENDPOINT_LOGOUT,
} from 'variables/api-endpoints';

export interface RegisterData {
  data: string;
  sms_token: string;
}

export interface UpdatePasswordData {
  password: string;
  confirm_password: string;
  old_password: string | null;
}

export interface ForgotPassword {
  password: string;
  confirm_password: string;
  sms_token: string;
  data: string;
}

export interface UpdateUserData {
  email: string;
  // birthday: string;
  gender: string;
  address: string;
  job: string;
  workplace: string;
}

export interface VerifyOTPData {
  data: string;
  token_sms_otp: string;
  otp: string;
}

export const checkUser = (data: { data: string }) => request.post(ENDPOINT_CHECK_USER, data);
export const generateOTP = (data: { data: string }) => request.post(ENDPOINT_GENERATE_OTP, data);
export const verifyOTP = (data: VerifyOTPData) => request.post(ENDPOINT_VERIFY_SMS_OTP, data);
export const register = (data: RegisterData) => request.post(ENDPOINT_CREATE_USER, data);
export const updatePassword = (data: UpdatePasswordData) =>
  request.post(ENDPOINT_UPDATE_PASSWORD, data);
export const forgotPassword = (data: ForgotPassword) =>
  request.post(ENDPOINT_FORGOT_PASSWORD, data);
export const updateUser = (data: UpdateUserData) => request.post(ENDPOINT_UPDATE_USER, data);
export const getUserInfo = () => request.get(ENDPOINT_USER_INFO);
export const logout = () => request.post(ENDPOINT_LOGOUT);
