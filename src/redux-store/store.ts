import { useSelector as reactReduxUseSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import register, { RegisterState } from './register';
import auth, { AuthState } from './auth';
import forgotPassword, { ForgotPasswordState } from './forgotPassword';
import product, { ProductState } from './product';
import order, { OrderState } from './order';
import address, { AddressState } from './address';
import voucher, { VoucherState } from './voucher';

export interface RootState {
  register: RegisterState;
  auth: AuthState;
  forgotPassword: ForgotPasswordState;
  product: ProductState;
  order: OrderState;
  address: AddressState;
  voucher: VoucherState;
}

type UseSelectorParams = (selector: (state: RootState) => any, equalFunction?: any) => any;

export const useSelector: UseSelectorParams = (selector, equalFunction) =>
  reactReduxUseSelector((state: RootState) => selector(state), equalFunction);

const store = configureStore({
  reducer: {
    register,
    auth,
    forgotPassword,
    product,
    order,
    address,
    voucher,
  },
});

export default store;
