import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as UserServices from 'services/users';
import { RootState } from './store';

export const checkUserExist = createAsyncThunk(
  'User/checkExist',
  async (phone: string, thunkAPI) => {
    try {
      const result = await UserServices.checkUser({ data: phone });
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const generateOTP = createAsyncThunk('User/generateOTP', async (phone: string, thunkAPI) => {
  try {
    const result = await UserServices.generateOTP({ data: phone });
    return { phone, ...result.data };
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const verifyOTP = createAsyncThunk('User/verifyOTP', async (otp: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const { smsToken, phone } = state.register;
    if (!phone || !smsToken) {
      return null;
    }

    const result = await UserServices.verifyOTP({ data: phone, token_sms_otp: smsToken, otp });
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const forgotPassword = createAsyncThunk(
  'User/updatePassword',
  async (data: { password: string; sms_token: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;

      const result = await UserServices.forgotPassword({
        password: data.password,
        confirm_password: data.password,
        sms_token: state.forgotPassword.smsToken as string,
        data: state.forgotPassword.phone as string,
      });
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export interface ForgotPasswordState {
  loading?: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  phone?: string;
  smsToken?: string;
  userToken?: string;
}

const initialState = {
  loading: false,
  error: null,
  phone: '',
  smsToken: '',
};

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(checkUserExist.pending, state => {
      state.loading = true;
    });
    builder.addCase(checkUserExist.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(checkUserExist.rejected, state => {
      state.loading = false;
    });

    builder.addCase(generateOTP.pending, state => {
      state.loading = true;
    });
    builder.addCase(generateOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.smsToken = action.payload.token_sms_otp;
      state.phone = action.payload.phone;
    });
    builder.addCase(generateOTP.rejected, state => {
      state.loading = false;
    });

    builder.addCase(verifyOTP.pending, state => {
      state.loading = true;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.smsToken = action.payload.sms_token;
    });
    builder.addCase(verifyOTP.rejected, state => {
      state.loading = false;
    });

    builder.addCase(forgotPassword.pending, state => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, state => {
      state.loading = false;
    });
  },
});

export default forgotPasswordSlice.reducer;
