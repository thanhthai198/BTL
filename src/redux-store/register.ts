import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as UserServices from 'services/users';
import StorageHelper from 'utils/storage-helper';
import { RootState } from './store';

export const checkUserExist = createAsyncThunk(
  'User/checkExist',
  async (phone: string, thunkAPI) => {
    try {
      const result = await UserServices.checkUser({ data: phone });
      console.log('result', result);
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

export const registerNewUser = createAsyncThunk('User/register', async (a, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const { smsToken, phone } = state.register;
    if (!phone || !smsToken) {
      return null;
    }

    const result = await UserServices.register({ data: phone, sms_token: smsToken });
    StorageHelper.saveUserToken(result.data.token);
    StorageHelper.saveUserInfo(result.data);
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const updatePassword = createAsyncThunk(
  'User/updatePassword',
  async (data: { password: string; old_password: string | null }, thunkAPI) => {
    try {
      const result = await UserServices.updatePassword({
        password: data.password,
        confirm_password: data.password,
        old_password: data.old_password,
      });
      return result.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const updateUser = createAsyncThunk('User/updateUser', async (data: any, thunkAPI) => {
  try {
    const result = await UserServices.updateUser(data);
    StorageHelper.saveUserInfo(result.data);
    return result.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export interface RegisterState {
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

const registerSlice = createSlice({
  name: 'register',
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
    builder.addCase(registerNewUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(registerNewUser.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(registerNewUser.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, state => {
      state.loading = false;
    });
  },
});

export default registerSlice.reducer;
